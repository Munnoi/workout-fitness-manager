import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-primary mb-4">FitLife</h3>
            <p className="text-gray-400">
              Your journey to a healthier lifestyle starts here. Transform your body and mind with our personalized workout plans.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/workouts" className="text-gray-400 hover:text-white">
                  Workouts
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Programs</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/workouts?goal=weight_loss" className="text-gray-400 hover:text-white">
                  Weight Loss
                </Link>
              </li>
              <li>
                <Link to="/workouts?goal=muscle_gain" className="text-gray-400 hover:text-white">
                  Muscle Building
                </Link>
              </li>
              <li>
                <Link to="/workouts?goal=general_fitness" className="text-gray-400 hover:text-white">
                  General Fitness
                </Link>
              </li>
              <li>
                <Link to="/workouts?difficulty=beginner" className="text-gray-400 hover:text-white">
                  Beginner Friendly
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FiFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FiTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FiInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FiYoutube size={24} />
              </a>
            </div>
            <p className="text-gray-400">
              Email: support@fitlife.com
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} FitLife Workout Planner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
