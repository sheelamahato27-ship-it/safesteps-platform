import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface LanguageSelectorProps {
  variant?: "default" | "compact";
}

export const LanguageSelector = ({ variant = "default" }: LanguageSelectorProps) => {
  const { language, setLanguage, languages } = useLanguage();

  const currentLanguage = languages.find(l => l.code === language);
  const indianLanguages = languages.filter(l => l.region === "india");
  const foreignLanguages = languages.filter(l => l.region === "foreign");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "compact" ? (
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Globe className="w-4 h-4" />
            <span>{currentLanguage?.code.toUpperCase() || "EN"}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        ) : (
          <Button variant="ghost" size="sm" className="gap-2">
            <Globe className="w-4 h-4" />
            <span>{currentLanguage?.nativeName || "English"}</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass">
        <ScrollArea className="h-[400px]">
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            Indian Languages
          </DropdownMenuLabel>
          {indianLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className="cursor-pointer flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span>{lang.nativeName}</span>
                <span className="text-xs text-muted-foreground">({lang.name})</span>
              </span>
              {language === lang.code && <Check className="w-4 h-4 text-primary" />}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            International Languages
          </DropdownMenuLabel>
          {foreignLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className="cursor-pointer flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span>{lang.nativeName}</span>
                <span className="text-xs text-muted-foreground">({lang.name})</span>
              </span>
              {language === lang.code && <Check className="w-4 h-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
