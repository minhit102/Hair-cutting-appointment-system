import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';

const LIGHTX_API_URL =
  'https://api.lightxeditor.com/external/api/v2/uploadImageUrl';
const LIGHTX_HAIRSTYLE_API_URL =
  'https://api.lightxeditor.com/external/api/v1/hairstyle';
const LIGHTX_ORDER_STATUS_API_URL =
  'https://api.lightxeditor.com/external/api/v1/order-status';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly lightXApiUrl = LIGHTX_API_URL;
  private readonly lightXHairstyleApiUrl = LIGHTX_HAIRSTYLE_API_URL;
  private readonly lightXApiKey: string;

  constructor() {
    this.lightXApiKey = process.env.LIGHTX_API_KEY;
    if (!this.lightXApiKey) {
      throw new Error(
        'LIGHTX_API_KEY is not configured in environment variables',
      );
    }
  }

  getHello() {
    return ' Hello World!';
  }

  async getPreSignedUrl(imageData: { size: number; contentType: string }) {
    console.log('=============================>', 'imageData', imageData);
    try {
      const response = await axios.post(
        this.lightXApiUrl,
        {
          uploadType: 'imageUrl',
          size: imageData.size,
          contentType: imageData.contentType.toString(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.lightXApiKey,
          },
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error getting pre-signed URL: ${error.message}`);
      throw error;
    }
  }

  async uploadImageLightX({ imageUrl, textPrompt }) {
    try {
      console.log('=============================>', 'imageUrl', imageUrl);
      console.log('=============================>', 'textPrompt', textPrompt);
      const lightXResponse = await axios.post(
        this.lightXHairstyleApiUrl,
        {
          imageUrl: imageUrl,
          textPrompt: textPrompt,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.lightXApiKey,
          },
        },
      );
      return lightXResponse.data;
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw error;
    }
  }

  async getOrderStatus(orderId: string) {
    try {
      const response = await axios.post(
        LIGHTX_ORDER_STATUS_API_URL,
        { orderId },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.lightXApiKey,
          },
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error getting order status: ${error.message}`);
      throw error;
    }
  }
}
