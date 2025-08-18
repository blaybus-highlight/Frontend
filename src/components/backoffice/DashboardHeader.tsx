import nafalLogoDashboard from "@/assets/nafal-logo-dashboard.png";

const DashboardHeader = () => {
  return (
    <div className="flex items-center self-stretch bg-nafal-black py-[15px] pl-16 pr-12">
      <img
        src={nafalLogoDashboard.src}
        alt="NAFAL"
        className="w-24 h-8 mr-4 object-fill"
      />
      <span className="text-nafal-white text-2xl font-bold mr-0.5">
        판매자센터
      </span>
      <div className="flex flex-1 flex-col items-end">
        <div className="flex items-start">
          <button className="flex flex-col shrink-0 items-start bg-nafal-black text-left p-2.5 mr-2 rounded-lg border-0">
            <div className="w-5 h-5 bg-nafal-gray rounded-sm"></div>
          </button>
          <span className="text-nafal-gray text-base font-bold my-2.5 mx-4">
            고객센터
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;