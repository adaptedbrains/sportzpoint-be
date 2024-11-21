import { config } from 'dotenv';

config()

export const environment = {
    PORT: process.env.PORT || 8000,
}