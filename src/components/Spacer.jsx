const Spacer = ({ size = "default" }) => {
  const sizes = {
    small: "h-12", // 48px
    default: "h-16", // 64px - matches navbar height
    large: "h-20", // 80px
    xlarge: "h-24", // 96px
  };

  return (
    <div
      className={`${sizes[size]} bg-gradient-to-r from-primary/5 via-base-200 to-secondary/5 backdrop-blur-sm`}
    />
  );
};

export default Spacer;
