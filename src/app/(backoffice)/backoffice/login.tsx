import NafalHeader from "@/components/backoffice/NafalHeader";
import NafalLoginForm from "@/components/backoffice/NafalLoginForm";
import NafalFooter from "@/components/backoffice/NafalFooter";

const Index = () => {
  return (
    <div className="flex flex-col bg-background">
      <div className="self-stretch bg-background h-[1088px]">
        <NafalLoginForm />
        <NafalFooter />
      </div>
    </div>
  );
};

export default Index;
