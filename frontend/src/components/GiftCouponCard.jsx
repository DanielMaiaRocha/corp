import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../../stores/useCartStore";

const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
	const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

	useEffect(() => {
		getMyCoupon();
	}, [getMyCoupon]);

	useEffect(() => {
		if (coupon) setUserInputCode(coupon.code);
	}, [coupon]);

	const handleApplyCoupon = () => {
		if (!userInputCode) return;
		applyCoupon(userInputCode);
	};

	const handleRemoveCoupon = async () => {
		await removeCoupon();
		setUserInputCode("");
	};

	return (
		<motion.div
			className='space-y-4 rounded-lg border  bg-white p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div className='space-y-4'>
				<div>
					<label htmlFor='voucher' className='mb-2 block text-sm font-medium text-gray-700'>
						Você possui algum coupon de desconto?
					</label>
					<input
						type='text'
						id='voucher'
						className='block w-full rounded-lg border  bg-white 
            p-2.5 text-sm text-black placeholder-gray-400 focus:border-red-500 
            focus:ring-red-500'
						placeholder='Insira o codigo aqui'
						value={userInputCode}
						onChange={(e) => setUserInputCode(e.target.value)}
						required
					/>
				</div>

				<motion.button
					type='button'
					className='flex w-full items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleApplyCoupon}
				>
					Aplicar codigo
				</motion.button>
			</div>
			{isCouponApplied && coupon && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium text-gray-300'>Codigo Aplicado</h3>

					<p className='mt-2 text-sm text-gray-400'>
						{coupon.code} - {coupon.discountPercentage}% off
					</p>

					<motion.button
						type='button'
						className='mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 
            px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none
             focus:ring-4 focus:ring-red-300'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleRemoveCoupon}
					>
						Retirar coupon
					</motion.button>
				</div>
			)}

			{coupon && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium text-gray-300'>Seu coupon disponivel:</h3>
					<p className='mt-2 text-sm text-gray-400'>
						{coupon.code} - {coupon.discountPercentage}% off
					</p>
				</div>
			)}
		</motion.div>
	);
};
export default GiftCouponCard;