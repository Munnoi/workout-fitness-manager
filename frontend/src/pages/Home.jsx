import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTarget, FiTrendingUp, FiUsers, FiAward, FiPlay, FiActivity, FiHeart, FiChevronDown, FiCheck, FiStar, FiZap, FiCalendar, FiBarChart2 } from 'react-icons/fi';

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
      title: 'Expert Guidance',
      description: 'Access professional workout instructions and video tutorials for every exercise.',
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: 'Achieve Goals',
      description: 'Stay motivated with streaks, progress tracking, and celebrate every milestone.',
      color: 'text-orange-500',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      icon: <FiUsers className="w-6 h-6" />,
      title: 'Create Your Profile',
      description: 'Sign up and tell us about your fitness goals, experience level, and preferences.',
    },
    {
      step: '02',
      icon: <FiCalendar className="w-6 h-6" />,
      title: 'Choose a Program',
      description: 'Browse our library and enroll in a workout program that matches your goals.',
    },
    {
      step: '03',
      icon: <FiZap className="w-6 h-6" />,
      title: 'Start Training',
      description: 'Follow your daily workouts with video guides and track your progress.',
    },
    {
      step: '04',
      icon: <FiBarChart2 className="w-6 h-6" />,
      title: 'See Results',
      description: 'Watch your progress grow with detailed analytics and streak tracking.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Lost 25 lbs in 3 months',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      quote: 'FitLife completely transformed my approach to fitness. The personalized plans and progress tracking kept me motivated every single day!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Gained 15 lbs muscle',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      quote: 'The workout programs are incredibly well-structured. I\'ve seen more gains in 2 months than I did in a year at the gym alone.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Fitness enthusiast',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      quote: 'I love how easy it is to track my workouts and see my streaks. It\'s like having a personal trainer in my pocket!',
      rating: 5,
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/80 to-pink-900/80 z-10"></div>
        <div className="absolute inset-0 bg-black/30 z-10"></div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-8 border border-white/20"
          >
            <FiZap className="mr-2 text-yellow-400" />
            Join 10,000+ fitness enthusiasts
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Transform Your Body,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">Transform Your Life</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-lg sm:text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed"
          >
            Personalized workout plans, expert guidance, and progress tracking — everything you need to achieve your fitness goals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1 transition-all duration-300"
            >
              Get Started Free
            </Link>
            <Link
              to="/workouts"
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            >
              <FiPlay className="mr-2" />
              Browse Programs
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300"
          >
            <div className="flex items-center">
              <FiCheck className="mr-2 text-green-400" /> No credit card required
            </div>
            <div className="flex items-center">
              <FiCheck className="mr-2 text-green-400" /> Cancel anytime
            </div>
            <div className="flex items-center">
              <FiCheck className="mr-2 text-green-400" /> 500+ workout programs
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center text-white/60"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <FiChevronDown className="text-2xl" />
          </motion.div>
        </motion.div>

        {/* Floating Abstract Shapes */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-3xl z-10"
        />
        <motion.div
          animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl z-10"
        />
        <motion.div
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl z-10"
        />
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Start your fitness journey in 4 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection Line - Desktop */}
            <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary via-purple-500 to-pink-500"></div>

            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative text-center"
              >
                {/* Step Number */}
                <div className="relative z-10 w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                  {item.icon}
                </div>

                <span className="text-6xl font-bold text-gray-100 dark:text-gray-800 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-0">
                  {item.step}
                </span>

                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Why Choose FitLife?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to succeed in your fitness journey, all in one place.
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
                whileHover={{ y: -8 }}
                className="group p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 hover:border-transparent hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bg} rounded-bl-full opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>

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

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-10"
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
              { number: '1M+', label: 'Workouts Done', icon: <FiTrendingUp /> },
              { number: '98%', label: 'Success Rate', icon: <FiHeart /> },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5, type: "spring" }}
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

      {/* Testimonials Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Loved by <span className="text-primary">Thousands</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See what our community has to say about their transformation
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl relative"
              >
                {/* Quote mark */}
                <div className="absolute top-6 right-6 text-6xl text-primary/10 font-serif">"</div>

                {/* Stars */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed relative z-10">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-primary font-medium">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Programs Gallery Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
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
                whileHover={{ y: -10 }}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-xl"
              >
                <Link to={program.link} className="block w-full h-full">
                  <motion.img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h3 className="text-2xl font-bold text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {program.title}
                    </h3>
                    <p className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 transform translate-y-4 group-hover:translate-y-0">
                      {program.description}
                    </p>
                    <div className="mt-4 flex items-center text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                      View Program <FiPlay className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link
              to="/workouts"
              className="inline-flex items-center px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              See All Programs
              <FiPlay className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=1920&auto=format&fit=crop"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/95 to-indigo-900/95"></div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-8 border border-white/20"
          >
            <FiZap className="mr-2 text-yellow-400" />
            Start your transformation today
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Ready to Become the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400">Best Version of You?</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto"
          >
            Join thousands who have already transformed their lives. Your journey starts with a single step.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white/20 transition-all duration-300"
            >
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
