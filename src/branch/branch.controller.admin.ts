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

@Controller('branches')
export class BranchAdminController {
  constructor(private readonly branchAdminService: BranchAdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Post()
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchAdminService.create(createBranchDto);
  }
  @Get()
  findAll() {
    return this.branchAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchAdminService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchAdminService.update(id, updateBranchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchAdminService.remove(id);
  }
}
