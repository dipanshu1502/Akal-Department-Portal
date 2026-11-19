import React from 'react';
import TextSection from './layouts/TextSection';
import ImageTextSection from './layouts/ImageTextSection';
import CardGridSection from './layouts/CardGridSection';
import TimelineSection from './layouts/TimelineSection';
import BannerSection from './layouts/BannerSection';
import StatisticsSection from './layouts/StatisticsSection';
import GallerySection from './layouts/GallerySection';
import AccordionSection from './layouts/AccordionSection';

const layoutMap = {
  text: TextSection,
  image_text: ImageTextSection,
  card_grid: CardGridSection,
  timeline: TimelineSection,
  banner: BannerSection,
  statistics: StatisticsSection,
  gallery: GallerySection,
  accordion: AccordionSection,
};

export default function SectionRenderer({ section }) {
  if (!section || section.enabled === false) {
    return null;
  }

  const Component = layoutMap[section.layout_type] || TextSection;

  return <Component section={section} />;
}
