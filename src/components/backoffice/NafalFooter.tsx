import nafalFooterLogo from "@/assets/nafal-footer-logo.png";
import youtubeIcon from "@/assets/youtube-icon.png";
import instagramIcon from "@/assets/instagram-icon.png";

const NafalFooter = () => {
  return (
    <div className="flex flex-col items-center self-stretch py-12">
      <div className="w-[1200px]">
        <div className="flex items-start self-stretch mb-[73px]">
          {/* Left Section - Logo and Description */}
          <div className="flex flex-1 flex-col items-start pb-8 mr-3">
            <img
              src={nafalFooterLogo.src}
              alt="NAFAL"
              className="w-[72px] h-6 mb-[15px] object-fill"
            />
            <span className="text-nafal-gray-dark text-base w-[239px] mb-4 whitespace-pre-line">
              {"믿을 수 있는 가치 플랫폼, 나팔\n갖고 싶은 한정판 제품은 다 나팔에서"}
            </span>
            <div className="flex items-start gap-3">
              <img
                src={youtubeIcon.src}
                alt="YouTube"
                className="w-10 h-10 object-fill cursor-pointer"
              />
              <img
                src={instagramIcon.src}
                alt="Instagram"
                className="w-10 h-10 object-fill cursor-pointer"
              />
            </div>
          </div>

          {/* Middle Section - Services */}
          <div className="flex flex-col shrink-0 items-start pb-3 mr-12 gap-4">
            <span className="text-foreground text-sm font-bold mr-[25px]">
              서비스
            </span>
            <div className="flex flex-col items-start gap-3">
              <div className="flex flex-col items-center py-[1px] pr-[13px]">
                <span className="text-nafal-gray-dark text-sm cursor-pointer hover:underline">
                  회사소개
                </span>
              </div>
              <div className="flex flex-col items-center py-[1px] pr-[13px]">
                <span className="text-nafal-gray-dark text-sm cursor-pointer hover:underline">
                  검수기준
                </span>
              </div>
              <div className="flex flex-col items-center py-[1px]">
                <div className="flex flex-col items-center">
                  <span className="text-nafal-gray-dark text-sm cursor-pointer hover:underline">
                    페널티정책
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center py-[1px] pr-[13px]">
                <span className="text-nafal-gray-dark text-sm cursor-pointer hover:underline">
                  제휴문의
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Customer Service */}
          <div className="flex flex-col shrink-0 items-start pb-14 gap-4">
            <span className="text-foreground text-sm font-bold mr-[159px]">
              고객센터
            </span>
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-col items-center py-[1px] pr-[131px]">
                <span className="text-nafal-gray-dark text-sm">
                  02-786-8978
                </span>
              </div>
              <div className="flex flex-col items-center py-[1px] pr-[89px]">
                <span className="text-nafal-gray-dark text-[13px]">
                  support@soldout.kr
                </span>
              </div>
              <div className="flex flex-col items-center py-[1px] pr-[101px]">
                <span className="text-nafal-gray-dark text-sm">
                  평일 10:00 - 18:00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright and Legal */}
        <div className="flex justify-between items-start self-stretch">
          <div className="flex flex-col shrink-0 items-center">
            <span className="text-nafal-gray-dark text-sm">
              @2024 NAFAL. All rights reserved.
            </span>
          </div>
          <div className="flex shrink-0 items-start">
            <div className="flex flex-col shrink-0 items-center mr-6">
              <span className="text-nafal-gray-dark text-sm cursor-pointer hover:underline">
                이용약관
              </span>
            </div>
            <span className="text-nafal-gray-dark text-sm mr-3 cursor-pointer hover:underline">
              개인정보처리방침
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NafalFooter;