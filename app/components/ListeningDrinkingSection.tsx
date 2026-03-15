"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

type NowPlaying =
  | { isPlaying: true; track: string; artists: string; albumArtUrl: string | null; trackUrl: string | null }
  | { isPlaying: false }
  | null;

function useNowPlaying() {
  const [data, setData] = useState<NowPlaying>(null);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch("/api/spotify/now-playing", { cache: "no-store" });
        if (cancelled) return;
        if (!res.ok) {
          setData({ isPlaying: false });
          return;
        }
        const json = await res.json();
        if (json.error) {
          setData({ isPlaying: false });
          return;
        }
        setData(json);
      } catch {
        if (!cancelled) setData({ isPlaying: false });
      }
    };

    poll();
    const interval = setInterval(poll, 20_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return data;
}
function PlayButtonSvg() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden
    >
      <path
        d="M16.8626 24.9375L24.5813 19.9896C24.9508 19.7521 25.1355 19.4222 25.1355 19C25.1355 18.5778 24.9508 18.2479 24.5813 18.0104L16.8626 13.0625C16.4667 12.7986 16.0641 12.7786 15.6545 13.0023C15.2449 13.2261 15.0407 13.576 15.0418 14.0521V23.9479C15.0418 24.4229 15.2465 24.7728 15.6561 24.9977C16.0656 25.2225 16.4678 25.2025 16.8626 24.9375ZM19.0001 34.8333C16.8098 34.8333 14.7515 34.4175 12.8251 33.5857C10.8987 32.7539 9.223 31.626 7.798 30.2021C6.373 28.7782 5.24514 27.1025 4.41442 25.175C3.58369 23.2476 3.16781 21.1892 3.16675 19C3.16569 16.8108 3.58158 14.7525 4.41442 12.825C5.24725 10.8976 6.37511 9.22187 7.798 7.79792C9.22089 6.37398 10.8966 5.24612 12.8251 4.41434C14.7536 3.58256 16.8119 3.16667 19.0001 3.16667C21.1882 3.16667 23.2466 3.58256 25.1751 4.41434C27.1036 5.24612 28.7793 6.37398 30.2022 7.79792C31.6251 9.22187 32.7534 10.8976 33.5873 12.825C34.4212 14.7525 34.8366 16.8108 34.8334 19C34.8303 21.1892 34.4144 23.2476 33.5858 25.175C32.7571 27.1025 31.6293 28.7782 30.2022 30.2021C28.7751 31.626 27.0994 32.7544 25.1751 33.5873C23.2508 34.4201 21.1925 34.8355 19.0001 34.8333Z"
        fill="#FFE7D0"
      />
    </svg>
  );
}

function CoffeeIconSvg() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className="shrink-0"
      aria-hidden
    >
      <rect width="24" height="24" fill="url(#pattern0_9_69)" />
      <defs>
        <pattern
          id="pattern0_9_69"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_9_69"
            transform="scale(0.0111111)"
          />
        </pattern>
        <image
          id="image0_9_69"
          width="90"
          height="90"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAADvElEQVR4nO2du2tUQRSHP41uMIJCLDWG2Fn4FxgLLdXWwiiipWIiiqI2goXiAxWFBBUrjWClRYKF6QwYLSQqWIhNxNf6AsVHocXIwATC5e7mztzd5JzZ+eAHYTPPH5u5c8+5cwOJRCKRSCQSCT+WA2uBTcBO4AhwCbgDPAReAz+Bd8ApYLFn+9GzvICBvwHjqdO0CEuANUAvsA04AJwBbgJjwEvge4CBRfWBiKkA54DPTTTQR9FyXoC5LWF0VYC5LWG0EaZoMcIULUaY1O4ozrptk1Gu926raeckjjMCDDINlp2TOGL4JpuMPiIQE6nEMd+GmGQ0qiWO+TbEJKNRLXHMtyGmVYxOJBKJRCKRmHuamb02TZYduxpeCDDMBOo5ihgVYJgJ1AiKGBJgmAnUIIo4LsAwE6hjKGKHAMNMoPpQxAYBhplA2WcB1bBagGEmUF0oog34J8A04yk75kUo440A44ynplDIuADjjKfsg+3quC3AOOOpYRRyukGTfwtcALYA3UCHU7f77IIr04i+VB632Fty0h+AXQUP9Sx2Zcs+LWXHrI4tJSZ8F+gM6LPT1Q3t145ZHesCJ3sVWFhya3k9sG87ZnUsC5joaEmTp7Ft3A/o3445+gRANXC5qMUK4FOsAf8yCYB9ddppBwaAx8AvJ/tzv/tdLfZ79G/HqpaiCYCvdXYXK4FndepOujJ5VFzbRZcttQwWnOS1GvXbZzF5ptm1vtlXYwz4ZzmWM6HDHvUHPP707TJRlN3aA/5Z+nImdNmj/hMPoyc82j2hPeCfpTdnQvc86v/0MNqWLcqNnPrrUUxeAuBpk4z+4dHumPaAf5ZFOQmALwKWjlcxBPyLJAA6Ctbtb8LFcAHwJ1PXjlE9DwuYZLdgebS7rdts9SfrnHK9FmvAP8twA25YJkvcsHyLNeAfmgDYV6eNilsaJtwF0uqR+6zSgKVHZcA/NAFQbUJQ6XPMAf8yCYAHLp4812HSzUTAOo8JG3fxKmN2W40bkugC/nnvrTNzlMpa4e48ffuzY2zZEwAfXfCnyMtJbJk9gS/HUh3wz/I8wICZb4O5CGwFeoClTj3us0uuTEs84a/5BMAIETEkwNAoA/5FEgBGiI4SEX0CDK2l7URErwBDa0l1wF/TCYAuIqJN6AmAKAL+Gk4ATBEh4wKMjTLgn+WWAGOzsmOKjkMCjM3qIBGyCvgrwNxp/a2TAlPPSQEGT8s+rRQtC4ArAky+7MYSPRtdcH8u/7lC1fVp+04kEolEIpFIJBKJBI7/i7quQNYXB9cAAAAASUVORK5CYII="
        />
      </defs>
    </svg>
  );
}



const SECTION_HEIGHT = 88;
const HALF_HEIGHT = 44; // Min 44px for touch; Caramel row & "While Drinking" row

export default function ListeningDrinkingSection() {
  const { t } = useLanguage();
  const nowPlaying = useNowPlaying();

  const trackLabel =
    nowPlaying === null
      ? t("listening.track")
      : nowPlaying.isPlaying
        ? `${nowPlaying.artists} : ${nowPlaying.track}`
        : t("listening.notListening");

  return (
    <section
      className="grid w-full max-w-[562px] grid-cols-[281px_281px] gap-0 max-[562px]:grid-cols-1"
      style={{ marginTop: 70 }}
    >
      {/* Left: Currently Listening - 271px from navbar left, full height (68px) = right section, bg #1DB954 */}
      <div className="flex w-[281px] max-[562px]:w-full">
        <div
          className="flex w-[271px] max-[562px]:w-full items-center justify-between gap-3 rounded-[10px] px-4"
          style={{
            height: SECTION_HEIGHT,
            backgroundColor: "#1DB954",
          }}
        >
          <div className="min-w-0 flex-1 flex items-center gap-3">
            {nowPlaying?.isPlaying && nowPlaying.albumArtUrl && (
              <img
                src={nowPlaying.albumArtUrl}
                alt=""
                width={48}
                height={48}
                className="rounded shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <p
                className="font-outfit font-normal text-[#323232]"
                style={{ fontSize: 24, letterSpacing: "-0.05em" }}
              >
                {t("listening.title")}
              </p>
              {nowPlaying?.isPlaying && nowPlaying.trackUrl ? (
                <a
                  href={nowPlaying.trackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-outfit font-normal block truncate hover:underline"
                  style={{
                    fontSize: 16,
                    color: "var(--background)",
                  }}
                >
                  {trackLabel}
                </a>
              ) : (
                <p
                  className="font-outfit font-normal truncate"
                  style={{
                    fontSize: 16,
                    color: "var(--background)",
                  }}
                >
                  {trackLabel}
                </p>
              )}
            </div>
          </div>
          <PlayButtonSvg />
        </div>
      </div>

      {/* Right: 271px from navbar right - two rows of 34px each */}
      <div className="flex w-[281px] max-[562px]:w-full flex-col items-end">
        <div
          className="flex w-[236px] max-[562px]:w-full min-h-[44px] items-end font-outfit font-medium text-[#323232]"
          style={{
            minHeight: HALF_HEIGHT,
            fontSize: 29,
          }}
        >
          {t("listening.whileDrinking")}
        </div>
        <div
          className="flex w-[236px] max-[562px]:w-full min-h-[44px] items-center gap-3 rounded-[10px] px-4"
          style={{
            minHeight: HALF_HEIGHT,
            backgroundColor: "#FC6E20",
          }}
        >
          <CoffeeIconSvg />
          <span
            className="font-outfit font-medium"
            style={{
              fontSize: 16,
              color: "var(--background)",
            }}
          >
            {t("listening.drink")}
          </span>
        </div>
      </div>
    </section>
  );
}
