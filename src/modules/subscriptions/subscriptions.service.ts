import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Gym } from '../gyms/entities/gym.entity';
import { Member } from '../members/entities/member.entity';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly plansRepository: Repository<SubscriptionPlan>,
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(Gym)
    private readonly gymsRepository: Repository<Gym>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  async createPlan(createPlanDto: CreateSubscriptionPlanDto) {
    const gym = await this.gymsRepository.findOneBy({
      id: createPlanDto.gymId,
    });

    if (!gym) {
      throw new NotFoundException(
        `Gym with id ${createPlanDto.gymId} was not found.`,
      );
    }

    const plan = this.plansRepository.create({
      gym,
      code: createPlanDto.code,
      name: createPlanDto.name,
      description: createPlanDto.description,
      durationDays: createPlanDto.durationDays,
      priceCents: createPlanDto.priceCents,
      billingInterval: createPlanDto.billingInterval ?? 'monthly',
      isActive: createPlanDto.isActive ?? true,
    });

    try {
      const savedPlan = await this.plansRepository.save(plan);

      return this.normalizePlan(savedPlan);
    } catch (error) {
      this.handleConstraintError(
        error,
        'Subscription plan code already exists.',
      );
    }
  }

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    const member = await this.membersRepository.findOne({
      where: { id: createSubscriptionDto.memberId },
    });

    if (!member) {
      throw new NotFoundException(
        `Member with id ${createSubscriptionDto.memberId} was not found.`,
      );
    }

    const plan = await this.plansRepository.findOne({
      where: { id: createSubscriptionDto.planId },
    });

    if (!plan) {
      throw new NotFoundException(
        `Plan with id ${createSubscriptionDto.planId} was not found.`,
      );
    }

    if (!plan.isActive) {
      throw new BadRequestException(
        'Inactive subscription plans cannot be assigned.',
      );
    }

    if (plan.gym.id !== member.gym.id) {
      throw new NotFoundException(
        `Plan ${createSubscriptionDto.planId} does not belong to member ${createSubscriptionDto.memberId}'s gym.`,
      );
    }

    if (createSubscriptionDto.endDate < createSubscriptionDto.startDate) {
      throw new BadRequestException(
        'Subscription end date must be on or after the start date.',
      );
    }

    const subscription = this.subscriptionsRepository.create({
      member,
      plan,
      status: createSubscriptionDto.status ?? 'active',
      startDate: createSubscriptionDto.startDate,
      endDate: createSubscriptionDto.endDate,
      autoRenew: createSubscriptionDto.autoRenew ?? true,
      notes: createSubscriptionDto.notes,
    });

    const savedSubscription =
      await this.subscriptionsRepository.save(subscription);

    return this.normalizeSubscription(savedSubscription);
  }

  async findAllPlans() {
    const plans = await this.plansRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return plans.map((plan) => this.normalizePlan(plan));
  }

  async findAllSubscriptions() {
    const subscriptions = await this.subscriptionsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return subscriptions.map((subscription) =>
      this.normalizeSubscription(subscription),
    );
  }

  async findOneSubscription(id: number) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id },
    });

    return subscription ? this.normalizeSubscription(subscription) : null;
  }

  private normalizePlan(plan: SubscriptionPlan) {
    return {
      id: plan.id,
      gym: {
        id: plan.gym.id,
        code: plan.gym.code,
        name: plan.gym.name,
      },
      code: plan.code,
      name: plan.name,
      description: plan.description,
      durationDays: plan.durationDays,
      priceCents: plan.priceCents,
      billingInterval: plan.billingInterval,
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }

  private normalizeSubscription(subscription: Subscription) {
    return {
      id: subscription.id,
      member: {
        id: subscription.member.id,
        memberCode: subscription.member.memberCode,
        firstName: subscription.member.firstName,
        lastName: subscription.member.lastName,
        gym: {
          id: subscription.member.gym.id,
          code: subscription.member.gym.code,
          name: subscription.member.gym.name,
        },
      },
      plan: this.normalizePlan(subscription.plan),
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      autoRenew: subscription.autoRenew,
      notes: subscription.notes,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }

  private handleConstraintError(error: unknown, message: string): never {
    if (error instanceof QueryFailedError) {
      const databaseError = error.driverError as { code?: string };

      if (databaseError.code === '23505') {
        throw new ConflictException(message);
      }
    }

    throw error;
  }
}
