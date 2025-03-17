// export razorpay instance

import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RZP_KEY!,
  key_secret: process.env.NEXT_PUBLIC_RZP_SECRET!,
});

export default razorpay;