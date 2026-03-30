import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Company } from '../company/entities/company.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../auth/types/jws-payload.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(dto: CreateUserDto) {
    const company = await this.companyRepository.findOne({
      where: { id: dto.companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll(user: JwtPayload) {
    return this.userRepository.find({
      where: {
        companyId: user.companyId,
      },
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }
}
