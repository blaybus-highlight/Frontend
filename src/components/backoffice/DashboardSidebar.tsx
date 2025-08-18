import nafalSidebarLogo from "@/assets/nafal-sidebar-logo.png";

const DashboardSidebar = () => {
  const menuItems = ["경매", "상품", "고객", "권한", "설정"];

  return (
    <div className="flex flex-col shrink-0 items-start bg-background pt-8 pb-[647px] gap-4">
      <img
        src={nafalSidebarLogo.src}
        alt="NAFAL"
        className="w-[168px] h-10 mx-4 object-fill"
      />
      {menuItems.map((item) => (
        <div
          key={item}
          className="flex flex-col items-center bg-background pt-2 pb-[9px] pl-3 pr-[121px] mx-4"
        >
          <span className="text-nafal-gray text-xl font-bold">
            {item}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DashboardSidebar;