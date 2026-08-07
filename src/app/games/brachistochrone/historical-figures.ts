export interface HistoricalFigure {
  id: string;
  name: string;
  years: string;
  portraitSrc: string;
  portraitAlt: string;
  wikipediaUrl: string;
  blurb: string;
  accomplishments: string[];
}

export const historicalFigures: Record<string, HistoricalFigure> = {
  bernoulli: {
    id: "bernoulli",
    name: "Johann Bernoulli",
    years: "1667 – 1748",
    portraitSrc: "/games/brachistochrone/people/bernoulli.jpg",
    portraitAlt: "Portrait engraving of Johann Bernoulli",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Johann_Bernoulli",
    blurb:
      "A Swiss mathematician from the prolific Bernoulli family, and one of the founders of the calculus that Leibniz had only recently introduced to the world.",
    accomplishments: [
      "Posed the brachistochrone problem to Europe's mathematicians in 1696",
      "Taught calculus to Leonhard Euler",
      "Made foundational contributions to the calculus of variations and exponential functions",
    ],
  },
  newton: {
    id: "newton",
    name: "Isaac Newton",
    years: "1642 – 1726/27",
    portraitSrc: "/games/brachistochrone/people/newton.jpg",
    portraitAlt: "Portrait of Sir Isaac Newton by Godfrey Kneller, 1689",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Isaac_Newton",
    blurb:
      "By 1697 Newton had largely left mathematics behind for his role running the Royal Mint — until Bernoulli's challenge landed on his desk.",
    accomplishments: [
      "Formulated the laws of motion and universal gravitation",
      "Co-invented calculus alongside Leibniz",
      "Solved the brachistochrone problem in a single night, anonymously",
    ],
  },
};
