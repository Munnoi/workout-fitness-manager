import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px]">
      <motion.div
        className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-gray-500 dark:text-gray-400 font-medium"
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default Loading;
