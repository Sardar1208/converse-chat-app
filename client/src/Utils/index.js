export const RandomProfile = () => {
  const rno = (Math.floor(Math.random() * 24) % 6) + 1;
  return `/svg/Profile${rno}.svg`;
};

export const Profiles = {
  A: "/svg/Profile1.svg",
  B: "/svg/Profile2.svg",
  C: "/svg/Profile3.svg",
  D: "/svg/Profile4.svg",
  E: "/svg/Profile5.svg",
  F: "/svg/Profile6.svg",
};
