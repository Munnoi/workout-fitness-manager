import { motion } from 'framer-motion';
import { FiHeart, FiTarget, FiUsers, FiAward } from 'react-icons/fi';

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Head Trainer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    },
    {
      name: 'Mike Chen',
      role: 'Fitness Coach',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    },
    {
      name: 'Emily Davis',
      role: 'Nutrition Expert',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative text-white py-24 md:py-32"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1552674605-5d226f5abdff?q=80&w=1920&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Vibrant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-purple-900/85 to-pink-900/80 z-10"></div>
        <div className="absolute inset-0 bg-black/30 z-10"></div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg"
          >
            About FitLife
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-xl text-gray-100 max-w-3xl mx-auto drop-shadow"
          >
            We believe everyone deserves access to quality fitness guidance. Our mission is to make health and wellness achievable for people of all fitness levels.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-200">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-200">
                FitLife was founded with a simple goal: to help people transform their lives through fitness. We understand that starting a fitness journey can be overwhelming, which is why we have created structured, easy-to-follow workout plans for everyone.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-200">
                Whether you are looking to lose weight, build muscle, or simply improve your overall health, our programs are designed to meet you where you are and guide you to where you want to be.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-200">
                With personalized plans, progress tracking, and a supportive community, we are here to help you every step of the way.
              </p>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-2 gap-4"
            >
              <motion.div variants={scaleIn} whileHover={{ scale: 1.05 }} className="bg-primary/10 dark:bg-primary/20 p-6 rounded-xl text-center transition-colors duration-200">
                <FiHeart className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">Health First</h3>
              </motion.div>
              <motion.div variants={scaleIn} whileHover={{ scale: 1.05 }} className="bg-primary/10 dark:bg-primary/20 p-6 rounded-xl text-center transition-colors duration-200">
                <FiTarget className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">Goal Oriented</h3>
              </motion.div>
              <motion.div variants={scaleIn} whileHover={{ scale: 1.05 }} className="bg-primary/10 dark:bg-primary/20 p-6 rounded-xl text-center transition-colors duration-200">
                <FiUsers className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">Community</h3>
              </motion.div>
              <motion.div variants={scaleIn} whileHover={{ scale: 1.05 }} className="bg-primary/10 dark:bg-primary/20 p-6 rounded-xl text-center transition-colors duration-200">
                <FiAward className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">Results</h3>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Meet Our Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-200">
              Expert trainers dedicated to your success
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden transition-colors duration-200"
              >
                <motion.img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">{member.name}</h3>
                  <p className="text-primary">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-100 dark:border-yellow-900/30 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-start space-x-4"
          >
            <div className="flex-shrink-0">
              <FiHeart className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2 transition-colors duration-200">
                Health Disclaimer
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 transition-colors duration-200">
                Before starting any new exercise program, we recommend consulting with your healthcare provider, especially if you have any pre-existing health conditions or concerns. The workout programs provided by FitLife are for informational purposes and should not replace professional medical advice. Listen to your body and exercise within your limits.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;