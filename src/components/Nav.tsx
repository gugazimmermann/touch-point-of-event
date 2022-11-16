import { ReactElement } from "react";
import LogoIcon from "../images/LogoIcon";

const TITLE = process.env.REACT_APP_TITLE || "";
const URL = process.env.REACT_APP_URL || "";

type NavProps = {
  eventID?: string;
};

export default function Nav({ eventID }: NavProps): ReactElement {
  return (
    <nav id="header" className="fixed w-full z-30 top-0 bg-white shadow">
      <div className="flex flex-row items-center justify-between align-middle py-2 px-4 w-full container mx-auto">
        {eventID ? (
          <a
            className="flex flex-row items-center text-primary no-underline hover:no-underline font-bold text-2xl lg:text-2xl"
            href={`${URL}/${eventID}`}
          >
            <LogoIcon styles="h-10 w-10" />
            <span data-testid="title">{TITLE}</span>
          </a>
        ) : (
          <div className="flex flex-row items-center text-primary font-bold text-2xl lg:text-2xl">
            <LogoIcon styles="h-10 w-10" />
            <span data-testid="title">{TITLE}</span>
          </div>
        )}
      </div>
    </nav>
  );
}
