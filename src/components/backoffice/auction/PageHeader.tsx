interface PageHeaderProps {
  title?: string;
  subtitle?: string;
}

export const PageHeader = ({ title = "상품 등록", subtitle = "경매에 등록할 상품을 선택하세요." }: PageHeaderProps) => {
  return (
    <div className="flex flex-col items-start self-stretch gap-3">
      <span className="text-[#111416] text-[28px] font-bold ml-4">{title}</span>
      <span className="text-[#757575] text-m ml-4">{subtitle}</span>
      <div className="w-80 h-[21px] ml-4"></div>
    </div>
  );
};
