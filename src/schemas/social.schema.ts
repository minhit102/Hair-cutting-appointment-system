import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TopTweet, TopTweetSchema } from './topTweet.schema';
import { Types } from 'mongoose';

export type SocialDocument = Social & Document;

@Schema()
export class Social {
  @Prop({ required: true })
  mindshare: number;

  @Prop({ required: true })
  followers: number;

  @Prop({ required: true })
  smartFollowers: number;

  @Prop({ type: [TopTweetSchema], default: [] })
  topTweets: Types.Array<TopTweet>;

  @Prop({ required: true })
  avgImpressions: number;

  @Prop({ required: true })
  avgEngagement: number;
}

export const SocialSchema = SchemaFactory.createForClass(Social);
