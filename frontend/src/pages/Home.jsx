import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTarget, FiTrendingUp, FiUsers, FiAward, FiPlay, FiActivity, FiHeart } from 'react-icons/fi';

const Home = () => {
  const features = [
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: 'Personalized Plans',
      description: 'Workout plans tailored to your goals, whether its weight loss, muscle gain, or general fitness.',
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: 'Track Progress',
      description: 'Monitor your workouts, track streaks, and see your improvement over time.',
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Community Support',
      description: 'Join a community of like-minded individuals. Share tips, stay motivated, and grow together.',
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: 'Gamified Fitness',
      description: 'Earn badges, complete daily challenges, and celebrate every milestone you reach.',
      color: 'text-orange-500',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  const programs = [
    {
      title: 'Weight Loss',
      description: 'Burn fat and get lean with our cardio and HIIT programs.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&auto=format&fit=crop',
      link: '/workouts?goal=weight_loss',
    },
    {
      title: 'Muscle Building',
      description: 'Build strength and muscle with progressive resistance training.',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop',
      link: '/workouts?goal=muscle_gain',
    },
    {
      title: 'Yoga & Flexibility',
      description: 'Improve balance, flexibility, and find your inner peace.',
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=600&auto=format&fit=crop',
      link: '/workouts?goal=general_fitness',
    },
    {
      title: 'HIIT Intensity',
      description: 'Short, explosive workouts to boost your metabolism.',
      image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600&auto=format&fit=crop',
      link: '/workouts?goal=endurance',
    },
    {
      title: 'Strength Training',
      description: 'Master the big lifts and build a powerful physique.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop',
      link: '/workouts?goal=strength',
    },
    {
      title: 'Cardio Blast',
      description: 'Improve your heart health and endurance levels.',
      image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop',
      link: '/workouts?goal=general_fitness',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1920&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Vibrant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-purple-900/80 to-pink-900/80 z-10 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/30 z-10"></div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Ignite Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Potential</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed"
          >
            Experience a new era of fitness. Personalized training, real-time tracking, and a community that cheers for your every win.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Your Journey Free
            </Link>
            <Link
              to="/workouts"
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            >
              <FiPlay className="mr-2" />
              View Workouts
            </Link>
          </motion.div>
        </div>
        
        {/* Floating Abstract Shapes */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-3xl z-10"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl z-10"
        />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Why FitLife?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We combine cutting-edge technology with expert knowledge to bring you the ultimate fitness experience.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-transparent hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bg} rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500`}></div>
                
                <div className={`relative z-10 w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="relative z-10 text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="relative z-10 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Parallax Feel */}
      <section className="py-24 relative overflow-hidden bg-indigo-900 text-white">
         <div className="absolute inset-0 opacity-20" 
              style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px' 
              }}>
         </div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             {[
               { number: '10k+', label: 'Active Users', icon: <FiUsers /> },
               { number: '500+', label: 'Workout Plans', icon: <FiActivity /> },
               { number: '1M+', label: 'Workouts Completed', icon: <FiTrendingUp /> },
               { number: '98%', label: 'Goal Success Rate', icon: <FiHeart /> },
             ].map((stat, idx) => (
               <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
               >
                 <div className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                   {stat.number}
                 </div>
                 <div className="flex items-center justify-center text-indigo-200 font-medium">
                   <span className="mr-2">{stat.icon}</span> {stat.label}
                 </div>
               </motion.div>
             ))}
           </div>
         </div>
      </section>

      {/* Programs Gallery Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">
              Explore Our <span className="text-primary">Programs</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Find the perfect routine that fits your lifestyle and goals.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {programs.map((program, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-xl"
              >
                <Link to={program.link} className="block w-full h-full">
                  <motion.img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  <div className="absolute bottom-0 left-0 p-8 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {program.title}
                    </h3>
                    <p className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 transform translate-y-2 group-hover:translate-y-0">
                      {program.description}
                    </p>
                    <div className="mt-4 flex items-center text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      View Program <FiPlay className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/workouts" 
              className="inline-flex items-center px-8 py-3 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold rounded-full hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300"
            >
              See All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
           <img 
             src="https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=1920&auto=format&fit=crop" 
             alt="Background" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90"></div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Don't Wait for Opportunity. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400">Create It.</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto"
          >
            Your future self is waiting. Join a community that pushes you to be your absolute best.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/register"
              className="inline-block bg-white text-purple-900 px-10 py-5 rounded-full font-bold text-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300"
            >
              Join FitLife Now
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;