import { CSSProperties, Fragment } from 'react';

interface RevealWordsProps {
  text: string;
  startIndex?: number;
}

const RevealWords = ({ text, startIndex = 0 }: RevealWordsProps) => (
  <>
    {text.split(' ').map((word, index) => (
      <Fragment key={`${word}-${index}`}>
        {index > 0 ? ' ' : null}
        <span className="cine-line">
          <span
            className="cine-word"
            style={{ '--i': startIndex + index } as CSSProperties}
          >
            {word}
          </span>
        </span>
      </Fragment>
    ))}
  </>
);

export default RevealWords;
