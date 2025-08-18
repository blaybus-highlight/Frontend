import nafalLogo from "@/assets/nafal-logo.png";

const NafalHeader = () => {
  return (
    <div className="flex items-center self-stretch bg-nafal-black py-[15px] pl-16 pr-12">
      <img
        src={nafalLogo.src}
        alt="NAFAL"
        className="w-24 h-8 mr-4 object-fill"
      />
      <span className="text-nafal-white text-2xl font-bold mr-[3px]">
        판매자센터
      </span>
      <div className="flex flex-1 flex-col items-end">
        <div className="flex items-start">
          <span className="text-nafal-gray text-base font-bold my-2.5 ml-4 mr-6">
            로그인
          </span>
          <span className="text-nafal-gray text-base font-bold my-2.5 ml-4 mr-6">
            회원가입
          </span>
          <span className="text-nafal-gray text-base font-bold my-2.5 mx-4">
            고객센터
          </span>
        </div>
      </div>
    </div>
  );
};

export default NafalHeader;