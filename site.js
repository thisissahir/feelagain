(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const header = document.querySelector('.site-header');
  const art = document.querySelector('.hero-art');
  const targets = document.querySelectorAll('.hero-copy > *, .recognition-grid > div:first-child, .recognition-list p, .trust-grid > div, .why-grid > *, .offer-grid > *, .start-section > .container > h2, .start-card, .final-inner > *');
  // Content remains visible without JavaScript or when motion is reduced.
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add('is-visible');
      observer.unobserve(target);
    });
  }, { threshold: 0.08 });
  targets.forEach((target, index) => {
    target.style.setProperty('--delay', `${index % 3 * 65}ms`);
    target.classList.add('reveal');
    observer.observe(target);
  });
  let scheduled = false;
  function updateScroll() {
    scheduled = false;
    header.classList.toggle('is-scrolled', scrollY > 24);
    const rect = art.getBoundingClientRect();
    const offset = motion.matches ? 0 : Math.max(-20, Math.min(20, -rect.top * 0.055));
    art.style.setProperty('--scroll-y', `${offset}px`);
  }
  addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  motion.addEventListener('change', updateScroll);
  updateScroll();
  document.querySelectorAll('.start-card, .statement-panel, .hero-art').forEach(surface => {
    surface.addEventListener('pointermove', event => {
      if (motion.matches || !pointer.matches) return;
      const rect = surface.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      surface.style.setProperty('--tilt-x', `${(0.5 - y) * 2}deg`);
      surface.style.setProperty('--tilt-y', `${(x - 0.5) * 2}deg`);
    });
    surface.addEventListener('pointerleave', () => {
      surface.style.setProperty('--tilt-x', '0deg');
      surface.style.setProperty('--tilt-y', '0deg');
    });
  });
})();
