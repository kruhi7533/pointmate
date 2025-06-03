
import { Snowflake } from "lucide-react";
import { motion } from "framer-motion";

const Logo = () => {
  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="bg-indigo-500 rounded-full p-2 text-white">
        <Snowflake size={24} />
      </div>
      <span className="text-xl font-bold text-gray-800">PointMate</span>
    </motion.div>
  );
};

export default Logo;
