type BlipModel = {
  id: string;
  name: string;
  description: string;
  quadrant: Quadrant;
  ring: Ring;
  isNew: boolean;
};

type Props = {
  blips: BlipModel[];
  quadrants: Quadrant[];
  rings: Ring[];
};
