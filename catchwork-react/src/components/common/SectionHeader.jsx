const SectionHeader = ({ title, noBorder = false }) => {
  return (
    <div
      className={`section-header-container ${noBorder ? "" : "with-border"}`}
    >
      <h2 className="title">{title}</h2>
    </div>
  );
};

export default SectionHeader;
