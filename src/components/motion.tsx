"use client";

import { type HTMLMotionProps, motion } from "framer-motion";

export const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const fadeIn = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	transition: { duration: 0.3 },
};

export const staggerContainer = {
	animate: {
		transition: {
			staggerChildren: 0.06,
		},
	},
};

export const staggerItem = {
	initial: { opacity: 0, y: 16 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
	},
};

export function FadeInUp({
	children,
	delay = 0,
	className,
	...props
}: {
	children: React.ReactNode;
	delay?: number;
	className?: string;
} & HTMLMotionProps<"div">) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
}

export function StaggerContainer({
	children,
	className,
	...props
}: {
	children: React.ReactNode;
	className?: string;
} & HTMLMotionProps<"div">) {
	return (
		<motion.div
			initial="initial"
			animate="animate"
			variants={staggerContainer}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
}

export function StaggerItem({
	children,
	className,
	...props
}: {
	children: React.ReactNode;
	className?: string;
} & HTMLMotionProps<"div">) {
	return (
		<motion.div variants={staggerItem} className={className} {...props}>
			{children}
		</motion.div>
	);
}

export { motion };
