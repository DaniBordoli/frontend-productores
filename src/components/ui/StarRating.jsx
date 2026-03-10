import StarFilledSvg from '../../assets/StarFilled.svg';
import StarEmptySvg from '../../assets/StarEmpty.svg';

export const StarRating = ({ rating = 0, max = 5, size = 15 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: max }, (_, i) => (
      <img
        key={i}
        src={i < rating ? StarFilledSvg : StarEmptySvg}
        alt={i < rating ? 'star filled' : 'star empty'}
        width={size}
        height={size}
      />
    ))}
  </div>
);

export default StarRating;
