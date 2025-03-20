import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ProjectionElementType } from 'mongoose';

export type projectDocument = HydratedDocument<ProjectionElementType>;

@Schema({ timestamps: true })
export class Project {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    require: true,
  })
  category: string;
}

export const projectSchema = SchemaFactory.createForClass(Project);
