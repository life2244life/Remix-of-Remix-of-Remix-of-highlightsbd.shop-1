import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORY_TILES } from './data';

const FabCategoryGrid = () => (
  <section className="fab-container">
    <div className="mb-7 text-center">
      <h2 className="text-[22px] font-extrabold tracking-tight text-fab-ink sm:text-[28px]">Shop By Category</h2>
      <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-fab-accent" />
    </div>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {CATEGORY_TILES.map((c, i) => (
        <motion.div
          key={c.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          <Link to={c.to} className="group relative block h-[260px] overflow-hidden rounded-card sm:h-[320px] lg:h-[380px]">
            <img src={c.image} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5 text-white">
              <h3 className="text-lg font-bold">{c.name}</h3>
              <p className="text-xs text-white/80">{c.count}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);

export default FabCategoryGrid;
