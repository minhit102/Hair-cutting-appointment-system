import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TopTweetDocument = TopTweet & Document;

@Schema({
  timestamps: true,
  collection: 'top-tweets',
})
export class TopTweet {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  likes: number;
}

export const TopTweetSchema = SchemaFactory.createForClass(TopTweet);
