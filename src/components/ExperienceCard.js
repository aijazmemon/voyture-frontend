// ExperienceCard.js
import React from 'react';
import './ExperienceCard.css';

const ExperienceCard = ({ experience }) => {
  return (
    <div className="experience-card">
      <img src={experience.image} alt={experience.title} className="experience-image" />
      <h3 className="experience-title">{experience.title}</h3>
      <p className="experience-description">{experience.description}</p>
    </div>
  );
};

export default ExperienceCard;
