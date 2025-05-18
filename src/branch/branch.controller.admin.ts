import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/strategies/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { BranchAdminService } from './branch.service.admin';
import { User } from 'src/common/decorator/user.decorator';

@Controller('admin/branches')
export class BranchAdminController {
  constructor(private readonly branchAdminService: BranchAdminService) {}

  @Get()
  findAll() {
    return this.branchAdminService.findAll();
  }

  @Get('/dashboard')
  @UseGuards(JwtAuthGuard)
  getBranchList(@User() user: any) {
    return this.branchAdminService.getDashboardBranch(user);
  }
}
