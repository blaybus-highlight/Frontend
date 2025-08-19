interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex items-start self-stretch p-3 gap-3 w-full border-b border-[#BDBDBD] mr-4">
      <button 
        className={`py-2 px-4 transition-colors ${
          activeTab === "individual" 
            ? "text-black border-b-2 border-black font-bold" 
            : "text-[#BDBDBD] hover:text-black"
        }`} 
        onClick={() => onTabChange("individual")}
      >
        개별 등록
      </button>
      <button 
        className={`py-2 px-4 transition-colors ${
          activeTab === "bulk" 
            ? "text-black border-b-2 border-black font-bold" 
            : "text-[#BDBDBD] hover:text-black"
        }`} 
        onClick={() => onTabChange("bulk")}
      >
        일괄 등록(Excel)
      </button>
    </div>
  );
};
