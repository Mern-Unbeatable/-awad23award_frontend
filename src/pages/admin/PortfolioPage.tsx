import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useMatch } from "react-router-dom";
import {
  Plus,
  ChevronRight,
  Upload,
  X,
  ImageIcon,
  Lock,
  Check,
} from "lucide-react";
import {
  adminApi,
  extractUploadedUrl,
  resolveMediaUrl,
  isBlobUrl,
} from "../../lib/api";
import { portfolioFormToTabbedPayload } from "../../lib/portfolioMappers";
import { confirmDelete, showSuccessToast } from "../../lib/swal";
import { AdminContentCard } from "../../components/admin/AdminContentCard";
import { usePortfolioAdmin } from "../../features/admin/portfolio/portfolioHooks";

import { AdminPaginationBar } from "../../components/admin/AdminPaginationBar";
import { usePagination } from "../../hooks/usePagination";
import {
  ADMIN_ROUTES,
  ADMIN_PORTFOLIO_NEW,
  adminPortfolioEditPath,
} from "../../Router/adminRoutes";
import type {
  GalleryItem,
  ChallengeItem,
  ApproachCard,
  LeadershipCard,
  SolutionCard,
  OutcomeItem,
  SkillCard,
} from "../../types";

function ImageUpload({
  label,
  value,
  onChange,
  height = "h-36",
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  height?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  async function processFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, WebP, GIF).");
      return;
    }
    setError("");
    // Show local preview immediately — no waiting for upload
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);
    try {
      const response = await adminApi.uploadMedia(file);
      const uploaded = extractUploadedUrl(response) ?? "";
      if (!uploaded)
        throw new Error("Upload succeeded but no URL was returned");
      const persisted = resolveMediaUrl(uploaded);
      setPreview(persisted || uploaded);
      onChange(uploaded);
    } catch {
      setError("Upload failed. Please try again.");
      setPreview(value);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) processFile(f);
          e.target.value = "";
        }}
      />

      {preview ? (
        /* ── Preview state ── */
        <div
          className={`relative group rounded-xl overflow-hidden border border-slate-200 ${height} w-full bg-slate-100`}
        >
          <img
            src={isBlobUrl(preview) ? preview : resolveMediaUrl(preview)}
            alt=""
            className="w-full h-full object-cover"
          />

          {uploading && (
            <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-2">
              <div className="w-9 h-9 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white text-[12px] font-semibold">
                Uploading…
              </span>
            </div>
          )}

          {!uploading && (
            <>
              {/* Hover overlay — click anywhere to change */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) =>
                  e.key === "Enter" && inputRef.current?.click()
                }
                className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-200 flex items-center justify-center cursor-pointer"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 bg-white text-slate-800 text-[12.5px] font-semibold px-4 py-2 rounded-lg shadow-md pointer-events-none">
                  <Upload className="w-3.5 h-3.5" />
                  Change Image
                </span>
              </div>
              {/* Remove button — top-right */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview("");
                  onChange("");
                }}
                className="absolute top-2.5 right-2.5 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-md"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      ) : (
        /* ── Empty / dropzone state ── */
        <div
          role="button"
          tabIndex={0}
          onClick={() => !uploading && inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files[0];
            if (f) processFile(f);
          }}
          className={`w-full ${height} rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-200 select-none ${
            uploading
              ? "border-[#38BDF8] bg-sky-50/60 cursor-wait"
              : dragging
                ? "border-[#38BDF8] bg-sky-50 scale-[1.005]"
                : "border-slate-200 bg-slate-50 hover:border-[#38BDF8] hover:bg-sky-50/30 cursor-pointer"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-9 h-9 border-[3px] border-[#38BDF8] border-t-transparent rounded-full animate-spin" />
              <p className="text-[12px] text-[#38BDF8] font-semibold">
                Uploading…
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 px-4 text-center pointer-events-none">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${dragging ? "bg-sky-100" : "bg-slate-100"}`}
              >
                {dragging ? (
                  <ImageIcon className="w-6 h-6 text-[#38BDF8]" />
                ) : (
                  <Upload className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-600">
                  {dragging
                    ? "Drop to upload"
                    : "Click to upload or drag & drop"}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, WebP, GIF · max 10 MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11.5px] text-red-500 mt-1.5 font-medium">{error}</p>
      )}
    </div>
  );
}

function MultiImageUpload({
  label,
  values,
  onChange,
  max = 8,
}: {
  label?: string;
  values: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [draggingAdd, setDraggingAdd] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFiles(files: FileList) {
    const remaining = max - values.length;
    if (remaining <= 0) return;
    const fileArray = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining);
    if (!fileArray.length) return;

    setError("");
    setUploading(true);

    // Show local previews immediately while uploading in parallel
    const startCount = values.length;
    const localUrls = fileArray.map((f) => URL.createObjectURL(f));
    onChange([...values, ...localUrls]);

    const results = await Promise.allSettled(
      fileArray.map((file) => adminApi.uploadMedia(file)),
    );

    const serverUrls: string[] = [];
    let hadError = false;
    for (const result of results) {
      if (result.status === "fulfilled") {
        const url = extractUploadedUrl(result.value);
        if (url) serverUrls.push(url);
        else hadError = true;
      } else {
        hadError = true;
      }
    }

    if (hadError) setError("Some images could not be uploaded.");

    onChange([...values.slice(0, startCount), ...serverUrls]);
    setUploading(false);
  }

  function removeImage(idx: number) {
    onChange(values.filter((_, i) => i !== idx));
  }

  const canAdd = values.length < max;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          {label}
          <span className="ml-2 text-slate-400 font-normal normal-case">
            ({values.length}/{max})
          </span>
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) processFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
        {values.map((url, idx) => (
          <div
            key={idx}
            className="relative group h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
          >
            <img
              src={isBlobUrl(url) ? url : resolveMediaUrl(url)}
              alt={`Screenshot ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 pointer-events-none rounded-xl" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-sm"
              title="Remove"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}

        {/* Add button */}
        {canAdd && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => !uploading && inputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDraggingAdd(true);
            }}
            onDragLeave={() => setDraggingAdd(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDraggingAdd(false);
              if (e.dataTransfer.files.length)
                processFiles(e.dataTransfer.files);
            }}
            className={`h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all duration-200 select-none ${
              uploading
                ? "border-[#38BDF8] bg-sky-50 cursor-wait"
                : draggingAdd
                  ? "border-[#38BDF8] bg-sky-50"
                  : "border-slate-200 bg-slate-50 hover:border-[#38BDF8] hover:bg-sky-50/30 cursor-pointer"
            }`}
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus
                  className={`w-4 h-4 ${draggingAdd ? "text-[#38BDF8]" : "text-slate-400"}`}
                />
                <span className="text-[9px] font-semibold text-slate-400">
                  {draggingAdd ? "Drop" : "Add"}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11.5px] text-red-500 mt-2 font-medium">{error}</p>
      )}
    </div>
  );
}

interface PortfolioForm {
  titleEn: string;
  titleAr: string;
  slug: string;
  tag: string;
  published: boolean;
  excerptEn: string;
  excerptAr: string;
  heroImageUrl: string;
  client: string;
  role: string;
  roleEn: string;
  roleAr: string;
  duration: string;
  durationEn: string;
  durationAr: string;
  screenshots: string[];
  challengeHeadingEn: string;
  challengeHeadingAr: string;
  challengeBodyEn: string;
  challengeBodyAr: string;
  challengeItems: ChallengeItem[];
  challengeImageUrl: string;
  challengeCaption: string;
  challengeCaptionEn: string;
  challengeCaptionAr: string;
  challengeBadgeLabel: string;
  approachBodyEn: string;
  approachBodyAr: string;
  approachCards: ApproachCard[];
  approachInsightEn: string;
  approachInsightAr: string;
  leadershipBodyEn: string;
  leadershipBodyAr: string;
  leadershipCards: LeadershipCard[];
  leadershipBannerStatEn: string;
  leadershipBannerStatAr: string;
  solutionBodyEn: string;
  solutionBodyAr: string;
  solutionCards: SolutionCard[];
  solutionArchImageUrl: string;
  solutionArchLabelEn: string;
  solutionArchLabelAr: string;
  solutionArchTitleEn: string;
  solutionArchTitleAr: string;
  solutionArchBodyEn: string;
  solutionArchBodyAr: string;
  outcomeItems: OutcomeItem[];
  recognitionImageUrl: string;
  recognitionLabelEn: string;
  recognitionLabelAr: string;
  skillCards: SkillCard[];
}

const EMPTY_FORM: PortfolioForm = {
  titleEn: "",
  titleAr: "",
  slug: "",
  tag: "Case Study",
  published: false,
  excerptEn: "",
  excerptAr: "",
  heroImageUrl: "",
  client: "",
  role: "",
  roleEn: "",
  roleAr: "",
  duration: "",
  durationEn: "",
  durationAr: "",
  screenshots: [],
  challengeHeadingEn: "The Challenge",
  challengeHeadingAr: "",
  challengeBodyEn: "",
  challengeBodyAr: "",
  challengeItems: [
    {
      iconName: "AlertTriangle",
      title: "",
      titleEn: "",
      titleAr: "",
      body: "",
      bodyEn: "",
      bodyAr: "",
    },
  ],
  challengeImageUrl: "",
  challengeCaption: "",
  challengeCaptionEn: "",
  challengeCaptionAr: "",
  challengeBadgeLabel: "CRITICAL",
  approachBodyEn: "",
  approachBodyAr: "",
  approachInsightEn: "",
  approachInsightAr: "",
  approachCards: [
    {
      titleEn: "",
      titleAr: "",
      bodyEn: "",
      bodyAr: "",
      bulletsEn: [],
      bulletsAr: [],
    },
  ],
  leadershipBodyEn: "",
  leadershipBodyAr: "",
  leadershipCards: [
    {
      iconName: "Users",
      title: "",
      titleEn: "",
      titleAr: "",
      body: "",
      bodyEn: "",
      bodyAr: "",
    },
  ],
  leadershipBannerStatEn: "",
  leadershipBannerStatAr: "",
  solutionBodyEn: "",
  solutionBodyAr: "",
  solutionArchLabelEn: "",
  solutionArchLabelAr: "",
  solutionCards: [
    {
      color: "green",
      tagEn: "",
      tagAr: "",
      titleEn: "",
      titleAr: "",
      bodyEn: "",
      bodyAr: "",
    },
  ],
  solutionArchImageUrl: "",
  solutionArchTitleEn: "",
  solutionArchTitleAr: "",
  solutionArchBodyEn: "",
  solutionArchBodyAr: "",
  outcomeItems: [{ color: "emerald", textEn: "", textAr: "" }],
  recognitionImageUrl: "",
  recognitionLabelEn: "",
  recognitionLabelAr: "",
  skillCards: [{ num: "1", category: "", title: "", body: "" }],
};

function formFromItem(item: GalleryItem): PortfolioForm {
  return {
    titleEn: item.titleEn,
    titleAr: item.titleAr,
    slug: item.slug,
    tag: item.tag || "Case Study",
    published: item.published,
    excerptEn: item.excerptEn,
    excerptAr: item.excerptAr,
    heroImageUrl: item.heroImageUrl || "",
    client: item.client || "",
    role: item.role || "",
    roleEn: item.roleEn || item.role || "",
    roleAr: item.roleAr || "",
    duration: item.duration || "",
    durationEn: item.durationEn || item.duration || "",
    durationAr: item.durationAr || "",
    screenshots: item.screenshots || [],
    challengeHeadingEn: item.challengeHeadingEn || "The Challenge",
    challengeHeadingAr: item.challengeHeadingAr || "",
    challengeBodyEn: item.challengeBodyEn || "",
    challengeBodyAr: item.challengeBodyAr || "",
    challengeItems: item.challengeItems?.length
      ? item.challengeItems
      : EMPTY_FORM.challengeItems,
    challengeImageUrl: item.challengeImageUrl || "",
    challengeCaption: item.challengeCaption || item.challengeCaptionEn || "",
    challengeCaptionEn: item.challengeCaptionEn || item.challengeCaption || "",
    challengeCaptionAr: item.challengeCaptionAr || "",
    challengeBadgeLabel: item.challengeBadgeLabel || "CRITICAL",
    approachBodyEn: item.approachBodyEn || "",
    approachBodyAr: item.approachBodyAr || "",
    approachCards: item.approachCards?.length
      ? item.approachCards.map((card) => ({
          titleEn: card.titleEn ?? "",
          titleAr: card.titleAr ?? "",
          bodyEn: card.bodyEn ?? "",
          bodyAr: card.bodyAr ?? "",
          bulletsEn: splitLines(card.bulletsEn),
          bulletsAr: splitLines(card.bulletsAr),
        }))
      : EMPTY_FORM.approachCards,
    approachInsightEn: item.approachInsightEn || "",
    approachInsightAr: item.approachInsightAr || "",
    leadershipBodyEn: item.leadershipBodyEn || "",
    leadershipBodyAr: item.leadershipBodyAr || "",
    leadershipCards: item.leadershipCards?.length
      ? item.leadershipCards.map((card) => ({
          iconName: card.iconName ?? "Users",
          title: card.titleEn ?? card.title ?? "",
          titleEn: card.titleEn ?? card.title ?? "",
          titleAr: card.titleAr ?? "",
          body: card.bodyEn ?? card.body ?? "",
          bodyEn: card.bodyEn ?? card.body ?? "",
          bodyAr: card.bodyAr ?? "",
        }))
      : EMPTY_FORM.leadershipCards,
    leadershipBannerStatEn:
      item.leadershipBannerStatEn ??
      (item as typeof item & { leadershipBannerStat?: string }).leadershipBannerStat ??
      "",
    leadershipBannerStatAr:
      item.leadershipBannerStatAr ??
      (item as typeof item & { leadershipBannerStat?: string }).leadershipBannerStat ??
      "",
    solutionBodyEn: item.solutionBodyEn || "",
    solutionBodyAr: item.solutionBodyAr || "",
    solutionArchLabelEn:
      item.solutionArchLabelEn ??
      (item as typeof item & { solutionArchLabel?: string }).solutionArchLabel ??
      "",
    solutionArchLabelAr:
      item.solutionArchLabelAr ??
      (item as typeof item & { solutionArchLabel?: string }).solutionArchLabel ??
      "",
    solutionCards: item.solutionCards?.length
      ? item.solutionCards.map((card) => ({
          color: card.color,
          tagEn: card.tagEn ?? card.tag ?? "",
          tagAr: card.tagAr ?? card.tag ?? "",
          titleEn: card.titleEn ?? card.title ?? "",
          titleAr: card.titleAr ?? card.title ?? "",
          bodyEn: card.bodyEn ?? card.body ?? "",
          bodyAr: card.bodyAr ?? card.body ?? "",
        }))
      : EMPTY_FORM.solutionCards,
    solutionArchImageUrl: item.solutionArchImageUrl || "",
    solutionArchTitleEn:
      item.solutionArchTitleEn || item.solutionArchTitle || "",
    solutionArchTitleAr:
      item.solutionArchTitleAr || item.solutionArchTitle || "",
    solutionArchBodyEn: item.solutionArchBodyEn || item.solutionArchBody || "",
    solutionArchBodyAr: item.solutionArchBodyAr || item.solutionArchBody || "",
    outcomeItems: item.outcomeItems?.length
      ? item.outcomeItems.map((outcomeItem) => ({
          color: outcomeItem.color,
          textEn: outcomeItem.textEn ?? outcomeItem.text ?? "",
          textAr: outcomeItem.textAr ?? outcomeItem.text ?? "",
        }))
      : EMPTY_FORM.outcomeItems,
    recognitionImageUrl: item.recognitionImageUrl || "",
    recognitionLabelEn: item.recognitionLabelEn || item.recognitionLabel || "",
    recognitionLabelAr: item.recognitionLabelAr || item.recognitionLabel || "",
    skillCards: item.skillCards?.length
      ? item.skillCards.map((card) => ({
          num: card.num,
          categoryEn: card.categoryEn ?? card.category ?? "",
          categoryAr: card.categoryAr ?? card.category ?? "",
          titleEn: card.titleEn ?? card.title ?? "",
          titleAr: card.titleAr ?? card.title ?? "",
          bodyEn: card.bodyEn ?? card.body ?? "",
          bodyAr: card.bodyAr ?? card.body ?? "",
        }))
      : EMPTY_FORM.skillCards,
  };
}

const REQUIRED_MSG = "This field is required.";

function isBlank(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  return false;
}

function splitLines(value?: string[] | null): string[] {
  return (value ?? []).map((line) => line.trim()).filter(Boolean);
}

function isChallengeItemEmpty(item: ChallengeItem): boolean {
  return (
    isBlank(item.titleEn ?? item.title) &&
    isBlank(item.titleAr) &&
    isBlank(item.bodyEn ?? item.body) &&
    isBlank(item.bodyAr)
  );
}

function isApproachCardEmpty(card: ApproachCard): boolean {
  return (
    isBlank(card.titleEn) &&
    isBlank(card.titleAr) &&
    isBlank(card.bodyEn) &&
    isBlank(card.bodyAr) &&
    !splitLines(card.bulletsEn).length &&
    !splitLines(card.bulletsAr).length
  );
}

function isLeadershipCardEmpty(card: LeadershipCard): boolean {
  return (
    isBlank(card.titleEn ?? card.title) &&
    isBlank(card.titleAr) &&
    isBlank(card.bodyEn ?? card.body) &&
    isBlank(card.bodyAr)
  );
}

function isSolutionCardEmpty(card: SolutionCard): boolean {
  return (
    isBlank(card.tagEn ?? card.tag) &&
    isBlank(card.tagAr) &&
    isBlank(card.titleEn ?? card.title) &&
    isBlank(card.titleAr) &&
    isBlank(card.bodyEn ?? card.body) &&
    isBlank(card.bodyAr)
  );
}

function isOutcomeItemEmpty(item: OutcomeItem): boolean {
  return isBlank(item.textEn ?? item.text) && isBlank(item.textAr);
}

function isSkillCardEmpty(card: SkillCard): boolean {
  return (
    isBlank(card.categoryEn ?? card.category) &&
    isBlank(card.categoryAr) &&
    isBlank(card.titleEn ?? card.title) &&
    isBlank(card.titleAr) &&
    isBlank(card.bodyEn ?? card.body) &&
    isBlank(card.bodyAr)
  );
}

type PortfolioFieldErrors = Record<string, string>;

function validatePortfolioForm(form: PortfolioForm): {
  errors: PortfolioFieldErrors;
  firstTab: number;
} {
  const errors: PortfolioFieldErrors = {};

  if (isBlank(form.titleEn)) errors.titleEn = REQUIRED_MSG;
  if (isBlank(form.slug)) errors.slug = REQUIRED_MSG;

  form.challengeItems.forEach((item, idx) => {
    if (isChallengeItemEmpty(item)) return;
    if (isBlank(item.iconName))
      errors[`challengeItems.${idx}.iconName`] = REQUIRED_MSG;
    if (isBlank(item.titleEn ?? item.title))
      errors[`challengeItems.${idx}.titleEn`] = REQUIRED_MSG;
    if (isBlank(item.titleAr))
      errors[`challengeItems.${idx}.titleAr`] = REQUIRED_MSG;
    if (isBlank(item.bodyEn ?? item.body))
      errors[`challengeItems.${idx}.bodyEn`] = REQUIRED_MSG;
    if (isBlank(item.bodyAr))
      errors[`challengeItems.${idx}.bodyAr`] = REQUIRED_MSG;
  });

  form.approachCards.forEach((card, idx) => {
    if (isApproachCardEmpty(card)) return;
    if (isBlank(card.titleEn))
      errors[`approachCards.${idx}.titleEn`] = REQUIRED_MSG;
    if (isBlank(card.titleAr))
      errors[`approachCards.${idx}.titleAr`] = REQUIRED_MSG;
    if (isBlank(card.bodyEn))
      errors[`approachCards.${idx}.bodyEn`] = REQUIRED_MSG;
    if (isBlank(card.bodyAr))
      errors[`approachCards.${idx}.bodyAr`] = REQUIRED_MSG;
    if (!splitLines(card.bulletsEn).length)
      errors[`approachCards.${idx}.bulletsEn`] = REQUIRED_MSG;
    if (!splitLines(card.bulletsAr).length)
      errors[`approachCards.${idx}.bulletsAr`] = REQUIRED_MSG;
  });

  form.leadershipCards.forEach((card, idx) => {
    if (isLeadershipCardEmpty(card)) return;
    if (isBlank(card.iconName))
      errors[`leadershipCards.${idx}.iconName`] = REQUIRED_MSG;
    if (isBlank(card.titleEn ?? card.title))
      errors[`leadershipCards.${idx}.titleEn`] = REQUIRED_MSG;
    if (isBlank(card.titleAr))
      errors[`leadershipCards.${idx}.titleAr`] = REQUIRED_MSG;
    if (isBlank(card.bodyEn ?? card.body))
      errors[`leadershipCards.${idx}.bodyEn`] = REQUIRED_MSG;
    if (isBlank(card.bodyAr))
      errors[`leadershipCards.${idx}.bodyAr`] = REQUIRED_MSG;
  });

  form.solutionCards.forEach((card, idx) => {
    if (isSolutionCardEmpty(card)) return;
    if (isBlank(card.tagEn ?? card.tag))
      errors[`solutionCards.${idx}.tagEn`] = REQUIRED_MSG;
    if (isBlank(card.tagAr))
      errors[`solutionCards.${idx}.tagAr`] = REQUIRED_MSG;
    if (isBlank(card.titleEn ?? card.title))
      errors[`solutionCards.${idx}.titleEn`] = REQUIRED_MSG;
    if (isBlank(card.titleAr))
      errors[`solutionCards.${idx}.titleAr`] = REQUIRED_MSG;
    if (isBlank(card.bodyEn ?? card.body))
      errors[`solutionCards.${idx}.bodyEn`] = REQUIRED_MSG;
    if (isBlank(card.bodyAr))
      errors[`solutionCards.${idx}.bodyAr`] = REQUIRED_MSG;
  });

  form.outcomeItems.forEach((item, idx) => {
    if (isOutcomeItemEmpty(item)) return;
    if (isBlank(item.textEn ?? item.text))
      errors[`outcomeItems.${idx}.textEn`] = REQUIRED_MSG;
    if (isBlank(item.textAr))
      errors[`outcomeItems.${idx}.textAr`] = REQUIRED_MSG;
  });

  if (isBlank(form.recognitionLabelEn))
    errors.recognitionLabelEn = REQUIRED_MSG;
  if (isBlank(form.recognitionLabelAr))
    errors.recognitionLabelAr = REQUIRED_MSG;

  form.skillCards.forEach((card, idx) => {
    if (isSkillCardEmpty(card)) return;
    if (isBlank(card.num)) errors[`skillCards.${idx}.num`] = REQUIRED_MSG;
    if (isBlank(card.categoryEn ?? card.category))
      errors[`skillCards.${idx}.categoryEn`] = REQUIRED_MSG;
    if (isBlank(card.categoryAr))
      errors[`skillCards.${idx}.categoryAr`] = REQUIRED_MSG;
    if (isBlank(card.titleEn ?? card.title))
      errors[`skillCards.${idx}.titleEn`] = REQUIRED_MSG;
    if (isBlank(card.titleAr))
      errors[`skillCards.${idx}.titleAr`] = REQUIRED_MSG;
    if (isBlank(card.bodyEn ?? card.body))
      errors[`skillCards.${idx}.bodyEn`] = REQUIRED_MSG;
    if (isBlank(card.bodyAr)) errors[`skillCards.${idx}.bodyAr`] = REQUIRED_MSG;
  });

  const keys = Object.keys(errors);
  let firstTab = 0;
  if (keys.some((key) => key.startsWith("skillCards."))) firstTab = 6;
  if (keys.some((key) => key.startsWith("outcomeItems."))) firstTab = 5;
  if (keys.some((key) => key.startsWith("solutionCards."))) firstTab = 4;
  if (keys.some((key) => key.startsWith("leadershipCards."))) firstTab = 3;
  if (keys.some((key) => key.startsWith("approachCards."))) firstTab = 2;
  if (keys.some((key) => key.startsWith("challengeItems."))) firstTab = 1;
  if (keys.some((key) => key === "titleEn" || key === "slug")) firstTab = 0;

  return { errors, firstTab };
}

function validatePortfolioStep(
  form: PortfolioForm,
  tabIndex: number,
): PortfolioFieldErrors {
  const errors: PortfolioFieldErrors = {};

  if (tabIndex === 0) {
    if (isBlank(form.titleEn)) errors.titleEn = REQUIRED_MSG;
    if (isBlank(form.slug)) errors.slug = REQUIRED_MSG;
    return errors;
  }

  if (tabIndex === 1) {
    if (form.challengeItems.length < 5) {
      errors.challengeItems = "Add 5 challenge items to continue.";
    }
    form.challengeItems.forEach((item, idx) => {
      if (isBlank(item.iconName))
        errors[`challengeItems.${idx}.iconName`] = REQUIRED_MSG;
      if (isBlank(item.titleEn ?? item.title))
        errors[`challengeItems.${idx}.titleEn`] = REQUIRED_MSG;
      if (isBlank(item.titleAr))
        errors[`challengeItems.${idx}.titleAr`] = REQUIRED_MSG;
      if (isBlank(item.bodyEn ?? item.body))
        errors[`challengeItems.${idx}.bodyEn`] = REQUIRED_MSG;
      if (isBlank(item.bodyAr))
        errors[`challengeItems.${idx}.bodyAr`] = REQUIRED_MSG;
    });
    return errors;
  }

  if (tabIndex === 2) {
    if (form.approachCards.length < 4) {
      errors.approachCards = "Add 4 approach cards to continue.";
    }
    form.approachCards.forEach((card, idx) => {
      if (isBlank(card.titleEn))
        errors[`approachCards.${idx}.titleEn`] = REQUIRED_MSG;
      if (isBlank(card.titleAr))
        errors[`approachCards.${idx}.titleAr`] = REQUIRED_MSG;
      if (isBlank(card.bodyEn))
        errors[`approachCards.${idx}.bodyEn`] = REQUIRED_MSG;
      if (isBlank(card.bodyAr))
        errors[`approachCards.${idx}.bodyAr`] = REQUIRED_MSG;
      if (!splitLines(card.bulletsEn).length)
        errors[`approachCards.${idx}.bulletsEn`] = REQUIRED_MSG;
      if (!splitLines(card.bulletsAr).length)
        errors[`approachCards.${idx}.bulletsAr`] = REQUIRED_MSG;
    });
    return errors;
  }

  if (tabIndex === 3) {
    if (form.leadershipCards.length < 4) {
      errors.leadershipCards = "Add 4 leadership cards to continue.";
    }
    form.leadershipCards.forEach((card, idx) => {
      if (isBlank(card.iconName))
        errors[`leadershipCards.${idx}.iconName`] = REQUIRED_MSG;
      if (isBlank(card.titleEn ?? card.title))
        errors[`leadershipCards.${idx}.titleEn`] = REQUIRED_MSG;
      if (isBlank(card.titleAr))
        errors[`leadershipCards.${idx}.titleAr`] = REQUIRED_MSG;
      if (isBlank(card.bodyEn ?? card.body))
        errors[`leadershipCards.${idx}.bodyEn`] = REQUIRED_MSG;
      if (isBlank(card.bodyAr))
        errors[`leadershipCards.${idx}.bodyAr`] = REQUIRED_MSG;
    });
    return errors;
  }

  if (tabIndex === 4) {
    if (form.solutionCards.length < 4) {
      errors.solutionCards = "Add 4 feature cards to continue.";
    }
    form.solutionCards.forEach((card, idx) => {
      if (isBlank(card.tagEn ?? card.tag))
        errors[`solutionCards.${idx}.tagEn`] = REQUIRED_MSG;
      if (isBlank(card.tagAr))
        errors[`solutionCards.${idx}.tagAr`] = REQUIRED_MSG;
      if (isBlank(card.titleEn ?? card.title))
        errors[`solutionCards.${idx}.titleEn`] = REQUIRED_MSG;
      if (isBlank(card.titleAr))
        errors[`solutionCards.${idx}.titleAr`] = REQUIRED_MSG;
      if (isBlank(card.bodyEn ?? card.body))
        errors[`solutionCards.${idx}.bodyEn`] = REQUIRED_MSG;
      if (isBlank(card.bodyAr))
        errors[`solutionCards.${idx}.bodyAr`] = REQUIRED_MSG;
    });
    return errors;
  }

  if (tabIndex === 5) {
    if (form.outcomeItems.length < 3) {
      errors.outcomeItems = "Add 3 outcome items to continue.";
    }
    form.outcomeItems.forEach((item, idx) => {
      if (isBlank(item.textEn ?? item.text))
        errors[`outcomeItems.${idx}.textEn`] = REQUIRED_MSG;
      if (isBlank(item.textAr))
        errors[`outcomeItems.${idx}.textAr`] = REQUIRED_MSG;
    });
    if (isBlank(form.recognitionLabelEn))
      errors.recognitionLabelEn = REQUIRED_MSG;
    if (isBlank(form.recognitionLabelAr))
      errors.recognitionLabelAr = REQUIRED_MSG;
    return errors;
  }

  if (tabIndex === 6) {
    if (form.skillCards.length < 7) {
      errors.skillCards = "Add 7 skill cards to continue.";
    }
    form.skillCards.forEach((card, idx) => {
      if (isBlank(card.num)) errors[`skillCards.${idx}.num`] = REQUIRED_MSG;
      if (isBlank(card.categoryEn ?? card.category))
        errors[`skillCards.${idx}.categoryEn`] = REQUIRED_MSG;
      if (isBlank(card.categoryAr))
        errors[`skillCards.${idx}.categoryAr`] = REQUIRED_MSG;
      if (isBlank(card.titleEn ?? card.title))
        errors[`skillCards.${idx}.titleEn`] = REQUIRED_MSG;
      if (isBlank(card.titleAr))
        errors[`skillCards.${idx}.titleAr`] = REQUIRED_MSG;
      if (isBlank(card.bodyEn ?? card.body))
        errors[`skillCards.${idx}.bodyEn`] = REQUIRED_MSG;
      if (isBlank(card.bodyAr))
        errors[`skillCards.${idx}.bodyAr`] = REQUIRED_MSG;
    });
  }

  return errors;
}

function isPortfolioStepComplete(
  form: PortfolioForm,
  tabIndex: number,
): boolean {
  return Object.keys(validatePortfolioStep(form, tabIndex)).length === 0;
}

function isPortfolioStepUnlocked(
  form: PortfolioForm,
  tabIndex: number,
): boolean {
  if (tabIndex <= 0) return true;
  for (let step = 0; step < tabIndex; step += 1) {
    if (!isPortfolioStepComplete(form, step)) return false;
  }
  return true;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-[11.5px] text-red-500 mt-1.5 font-medium">{message}</p>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13.5px] text-slate-800 focus:outline-none focus:border-[#38BDF8] focus:bg-white transition-all";
const textareaCls = `${inputCls} resize-none`;

function fieldInputCls(hasError?: boolean) {
  return hasError
    ? `${inputCls} border-red-400 focus:border-red-500`
    : inputCls;
}

function fieldTextareaCls(hasError?: boolean) {
  return hasError
    ? `${textareaCls} border-red-400 focus:border-red-500`
    : textareaCls;
}

const TABS = [
  "Overview",
  "Challenge",
  "Approach",
  "Leadership",
  "Solution",
  "Outcome",
  "Skills",
];

const PORTFOLIO_PAGE_SIZE = 8;

/** Returns true if any image field still holds a local blob URL (upload in progress). */
function portfolioHasPendingUploads(form: PortfolioForm): boolean {
  const isBlobUrl = (u: string) => u.startsWith("blob:");
  return (
    isBlobUrl(form.heroImageUrl) ||
    isBlobUrl(form.challengeImageUrl) ||
    isBlobUrl(form.solutionArchImageUrl) ||
    isBlobUrl(form.recognitionImageUrl) ||
    form.screenshots.some(isBlobUrl)
  );
}

export function PortfolioPage() {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  const isNewPage = Boolean(
    useMatch({ path: "/admin/portfolio/new", end: true }),
  );
  const isEditPage = Boolean(
    useMatch({ path: "/admin/portfolio/:itemId/edit", end: true }),
  );
  const isFormMode = isNewPage || isEditPage;

  const {
    items,
    isLoading: loading,
    error: loadError,
    isSaving: saving,
    loadItems,
    createItem: createPortfolioItem,
    updateItem: savePortfolioItem,
    deleteItem: removePortfolioItem,
  } = usePortfolioAdmin();

  useEffect(() => {
    loadItems().catch(() => undefined);
  }, [loadItems]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState<PortfolioForm>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<PortfolioFieldErrors>({});
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  const { page, setPage, totalPages, paginatedItems, totalItems, pageSize } =
    usePagination(items, PORTFOLIO_PAGE_SIZE);

  useEffect(() => {
    if (isNewPage) {
      setForm(EMPTY_FORM);
      setEditingId(null);
      setActiveTab(0);
      setError("");
      setFieldErrors({});
      setShowFieldErrors(false);
      return;
    }
    if (isEditPage && itemId && !loading) {
      const item = items.find((i) => i.id === itemId);
      if (item) {
        setForm(formFromItem(item));
        setEditingId(item.id);
        setActiveTab(0);
        setError("");
        setFieldErrors({});
        setShowFieldErrors(false);
      } else {
        navigate(ADMIN_ROUTES.portfolio, { replace: true });
      }
    }
  }, [isNewPage, isEditPage, itemId, items, loading, navigate]);

  useEffect(() => {
    if (!showFieldErrors) return;
    const errors = validatePortfolioStep(form, activeTab);
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      setError("");
      setShowFieldErrors(false);
    }
  }, [form, showFieldErrors, activeTab]);

  function closeForm() {
    navigate(ADMIN_ROUTES.portfolio);
  }

  function setField<K extends keyof PortfolioForm>(
    key: K,
    value: PortfolioForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goToTab(target: number) {
    if (target === activeTab) return;
    if (!isPortfolioStepUnlocked(form, target)) return;
    if (target < activeTab) {
      setActiveTab(target);
      return;
    }

    for (let step = activeTab; step < target; step += 1) {
      const stepErrors = validatePortfolioStep(form, step);
      if (Object.keys(stepErrors).length > 0) {
        setFieldErrors(stepErrors);
        setShowFieldErrors(true);
        setActiveTab(step);
        setError("Please complete this step before continuing.");
        return;
      }
    }

    setFieldErrors({});
    setShowFieldErrors(false);
    setError("");
    setActiveTab(target);
  }

  function goToNextStep() {
    goToTab(activeTab + 1);
  }

  function openCreate() {
    navigate(ADMIN_PORTFOLIO_NEW);
  }

  function openEdit(item: GalleryItem) {
    navigate(adminPortfolioEditPath(item.id));
  }

  async function handleDelete(id: string) {
    const confirmed = await confirmDelete(
      "Delete Portfolio Item?",
      "Are you sure you want to delete this item?",
    );
    if (!confirmed) return;
    try {
      await removePortfolioItem(id);
    } catch (err) {
      console.error("Failed to delete portfolio item:", err);
    }
  }

  async function handleSave() {
    const validation = validatePortfolioForm(form);
    if (Object.keys(validation.errors).length > 0) {
      setFieldErrors(validation.errors);
      setShowFieldErrors(true);
      setActiveTab(validation.firstTab);
      setError("Please fill in all required fields.");
      return;
    }
    setFieldErrors({});
    setShowFieldErrors(false);

    if (!form.titleEn.trim() || !form.slug.trim()) {
      setError("Title (EN) and Slug are required.");
      setActiveTab(0);
      return;
    }
    if (portfolioHasPendingUploads(form)) {
      setError("Some images are still uploading. Please wait and try again.");
      return;
    }
    setError("");
    try {
      const payload = portfolioFormToTabbedPayload(form);
      if (editingId) {
        await savePortfolioItem(
          editingId,
          payload as unknown as Record<string, unknown>,
        );
      } else {
        await createPortfolioItem(
          payload as unknown as Record<string, unknown>,
        );
      }
      void showSuccessToast(
        editingId ? "Portfolio item updated" : "Portfolio item created",
      );
      navigate(ADMIN_ROUTES.portfolio);
    } catch (err) {
      console.error("Failed to save portfolio item:", err);
      setError(
        "Failed to save. Check required fields and that the API is running.",
      );
    }
  }

  function addItem<T>(key: keyof PortfolioForm, blank: T) {
    setForm((prev) => ({ ...prev, [key]: [...(prev[key] as T[]), blank] }));
  }

  function removeItem(key: keyof PortfolioForm, idx: number) {
    setForm((prev) => ({
      ...prev,
      [key]: (prev[key] as unknown[]).filter((_, i) => i !== idx),
    }));
  }

  function updateItem<T>(
    key: keyof PortfolioForm,
    idx: number,
    patch: Partial<T>,
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: (prev[key] as T[]).map((item, i) =>
        i === idx ? { ...item, ...patch } : item,
      ),
    }));
  }

  function renderOverview() {
    return (
      <div className="space-y-6">
        {/* Titles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Title (EN)" error={fieldErrors.titleEn}>
            <input
              className={fieldInputCls(Boolean(fieldErrors.titleEn))}
              value={form.titleEn}
              onChange={(e) => setField("titleEn", e.target.value)}
              placeholder="AD Squared"
            />
          </Field>
          <Field label="Title (AR)">
            <input
              className={inputCls}
              dir="rtl"
              value={form.titleAr}
              onChange={(e) => setField("titleAr", e.target.value)}
              placeholder="اد سكوار"
            />
          </Field>
        </div>

        {/* Client / Role / Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Role (EN)">
            <input
              className={inputCls}
              value={form.roleEn}
              onChange={(e) => setField("roleEn", e.target.value)}
              placeholder="CRM Consultant"
            />
          </Field>
          <Field label="Role (AR)">
            <input
              className={inputCls}
              dir="rtl"
              value={form.roleAr}
              onChange={(e) => setField("roleAr", e.target.value)}
              placeholder="مستشار CRM"
            />
          </Field>
          <Field label="Duration (EN)">
            <input
              className={inputCls}
              value={form.durationEn}
              onChange={(e) => setField("durationEn", e.target.value)}
              placeholder="6-Month Engagement"
            />
          </Field>
          <Field label="Duration (AR)">
            <input
              className={inputCls}
              dir="rtl"
              value={form.durationAr}
              onChange={(e) => setField("durationAr", e.target.value)}
              placeholder="تفاعل لمدة 6 أشهر"
            />
          </Field>
        </div>

        {/* Slug & Tag */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Client">
            <input
              className={inputCls}
              value={form.client}
              onChange={(e) => setField("client", e.target.value)}
              placeholder="REDF"
            />
          </Field>
          <Field label="Slug (URL path)" error={fieldErrors.slug}>
            <input
              className={fieldInputCls(Boolean(fieldErrors.slug))}
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
              placeholder="ad-squared"
            />
          </Field>
          <Field label="Tag Label">
            <input
              className={inputCls}
              value={form.tag}
              onChange={(e) => setField("tag", e.target.value)}
              placeholder="Case Study / Startup / Project"
            />
          </Field>
        </div>

        {/* Hero Image Upload */}
        <ImageUpload
          label="Hero / Cover Image"
          value={form.heroImageUrl}
          onChange={(url) => setField("heroImageUrl", url)}
        />

        {/* Excerpts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Excerpt (EN)">
            <textarea
              className={textareaCls}
              rows={3}
              value={form.excerptEn}
              onChange={(e) => setField("excerptEn", e.target.value)}
              placeholder="Short description shown in hero…"
            />
          </Field>
          <Field label="Excerpt (AR)">
            <textarea
              className={textareaCls}
              rows={3}
              dir="rtl"
              value={form.excerptAr}
              onChange={(e) => setField("excerptAr", e.target.value)}
              placeholder="وصف قصير…"
            />
          </Field>
        </div>

        {/* Screenshots — multi-upload */}
        <MultiImageUpload
          label="Project Screenshots"
          values={form.screenshots}
          onChange={(urls) => setField("screenshots", urls)}
          max={8}
        />

        {/* Published toggle */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            role="switch"
            aria-checked={form.published}
            onClick={() => setField("published", !form.published)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
              form.published ? "bg-[#38BDF8]" : "bg-slate-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                form.published ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-[13px] font-medium text-slate-700">
            {form.published
              ? "Published — visible on site"
              : "Draft — hidden from site"}
          </span>
        </div>
      </div>
    );
  }

  function renderChallenge() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Section Heading (EN)">
            <input
              className={inputCls}
              value={form.challengeHeadingEn}
              onChange={(e) => setField("challengeHeadingEn", e.target.value)}
              placeholder="The Challenge"
            />
          </Field>
          <Field label="Section Heading (AR)">
            <input
              className={inputCls}
              dir="rtl"
              value={form.challengeHeadingAr}
              onChange={(e) => setField("challengeHeadingAr", e.target.value)}
              placeholder="التحدي"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Section Body (EN)">
            <textarea
              className={textareaCls}
              rows={3}
              value={form.challengeBodyEn}
              onChange={(e) => setField("challengeBodyEn", e.target.value)}
            />
          </Field>
          <Field label="Section Body (AR)">
            <textarea
              className={textareaCls}
              rows={3}
              dir="rtl"
              value={form.challengeBodyAr}
              onChange={(e) => setField("challengeBodyAr", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Badge Label">
          <input
            className={inputCls}
            value={form.challengeBadgeLabel}
            onChange={(e) => setField("challengeBadgeLabel", e.target.value)}
            placeholder="CRITICAL"
          />
        </Field>

        {/* Challenge items */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Challenge Items ({form.challengeItems.length}/5)
            </label>
            {form.challengeItems.length < 5 && (
              <button
                type="button"
                onClick={() =>
                  addItem("challengeItems", {
                    iconName: "AlertTriangle",
                    title: "",
                    titleEn: "",
                    titleAr: "",
                    body: "",
                    bodyEn: "",
                    bodyAr: "",
                  })
                }
                className="relative text-[12px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer border-2 border-red-500 rounded-lg px-3 py-1.5 bg-red-50"
              >
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-600 border-2 border-white" />
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            )}
          </div>
          <p className="text-[12px] text-slate-400 mb-3">
            Add 5 challenge items in total. Each item needs an icon, title, and
            body.
          </p>
          <FieldError message={fieldErrors.challengeItems} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.challengeItems.map((ci, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Item #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem("challengeItems", idx)}
                    className="text-red-400 hover:text-red-600 text-[11px] font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <input
                  className={fieldInputCls(
                    Boolean(fieldErrors[`challengeItems.${idx}.iconName`]),
                  )}
                  placeholder="Icon name (Users, AlertTriangle, FileText, Code2, BookOpen)"
                  value={ci.iconName}
                  onChange={(e) =>
                    updateItem<ChallengeItem>("challengeItems", idx, {
                      iconName: e.target.value,
                    })
                  }
                />
                <FieldError
                  message={fieldErrors[`challengeItems.${idx}.iconName`]}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      className={fieldInputCls(
                        Boolean(fieldErrors[`challengeItems.${idx}.titleEn`]),
                      )}
                      placeholder="Title (EN)"
                      value={ci.titleEn ?? ci.title ?? ""}
                      onChange={(e) =>
                        updateItem<ChallengeItem>("challengeItems", idx, {
                          titleEn: e.target.value,
                          title: e.target.value,
                        })
                      }
                    />
                    <FieldError
                      message={fieldErrors[`challengeItems.${idx}.titleEn`]}
                    />
                  </div>
                  <div>
                    <input
                      className={fieldInputCls(
                        Boolean(fieldErrors[`challengeItems.${idx}.titleAr`]),
                      )}
                      dir="rtl"
                      placeholder="Title (AR)"
                      value={ci.titleAr ?? ""}
                      onChange={(e) =>
                        updateItem<ChallengeItem>("challengeItems", idx, {
                          titleAr: e.target.value,
                        })
                      }
                    />
                    <FieldError
                      message={fieldErrors[`challengeItems.${idx}.titleAr`]}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <textarea
                      className={fieldTextareaCls(
                        Boolean(fieldErrors[`challengeItems.${idx}.bodyEn`]),
                      )}
                      rows={2}
                      placeholder="Body Text (EN)"
                      value={ci.bodyEn ?? ci.body ?? ""}
                      onChange={(e) =>
                        updateItem<ChallengeItem>("challengeItems", idx, {
                          bodyEn: e.target.value,
                          body: e.target.value,
                        })
                      }
                    />
                    <FieldError
                      message={fieldErrors[`challengeItems.${idx}.bodyEn`]}
                    />
                  </div>
                  <div>
                    <textarea
                      className={fieldTextareaCls(
                        Boolean(fieldErrors[`challengeItems.${idx}.bodyAr`]),
                      )}
                      rows={2}
                      dir="rtl"
                      placeholder="Body Text (AR)"
                      value={ci.bodyAr ?? ""}
                      onChange={(e) =>
                        updateItem<ChallengeItem>("challengeItems", idx, {
                          bodyAr: e.target.value,
                        })
                      }
                    />
                    <FieldError
                      message={fieldErrors[`challengeItems.${idx}.bodyAr`]}
                    />
                  </div>
                </div>
              </div>
            ))}
            {form.challengeItems.length < 5 &&
              Array.from({ length: 5 - form.challengeItems.length }).map(
                (_, slot) => (
                  <button
                    key={`challenge-add-slot-${slot}`}
                    type="button"
                    onClick={() =>
                      addItem("challengeItems", {
                        iconName: "AlertTriangle",
                        title: "",
                        titleEn: "",
                        titleAr: "",
                        bodyEn: "",
                        bodyAr: "",
                      })
                    }
                    className="min-h-55 rounded-xl border-2 border-dashed border-red-500 bg-red-50/50 hover:bg-red-50 flex flex-col items-center justify-center gap-2 cursor-pointer text-red-600 transition-colors"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="text-[13px] font-semibold">Add Item</span>
                  </button>
                ),
              )}
          </div>
        </div>

        {/* Challenge image upload */}
        <ImageUpload
          label="Right Column Image"
          value={form.challengeImageUrl}
          onChange={(url) => setField("challengeImageUrl", url)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Right Column Caption (EN)">
            <textarea
              className={textareaCls}
              rows={2}
              value={form.challengeCaptionEn}
              onChange={(e) => {
                setField("challengeCaptionEn", e.target.value);
                setField("challengeCaption", e.target.value);
              }}
            />
          </Field>
          <Field label="Right Column Caption (AR)">
            <textarea
              className={textareaCls}
              rows={2}
              dir="rtl"
              value={form.challengeCaptionAr}
              onChange={(e) => setField("challengeCaptionAr", e.target.value)}
            />
          </Field>
        </div>
      </div>
    );
  }

  function renderApproach() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Section Intro (EN)">
            <textarea
              className={textareaCls}
              rows={3}
              value={form.approachBodyEn}
              onChange={(e) => setField("approachBodyEn", e.target.value)}
              placeholder="To rebuild the missing knowledge, I:"
            />
          </Field>
          <Field label="Section Intro (AR)">
            <textarea
              className={textareaCls}
              rows={3}
              dir="rtl"
              value={form.approachBodyAr}
              onChange={(e) => setField("approachBodyAr", e.target.value)}
            />
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Approach Cards ({form.approachCards.length}/4)
            </label>
            {form.approachCards.length < 4 && (
              <button
                type="button"
                onClick={() =>
                  addItem("approachCards", {
                    titleEn: "",
                    titleAr: "",
                    bodyEn: "",
                    bodyAr: "",
                    bulletsEn: [],
                    bulletsAr: [],
                  })
                }
                className="relative text-[12px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer border-2 border-red-500 rounded-lg px-3 py-1.5 bg-red-50"
              >
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-600 border-2 border-white" />
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            )}
          </div>
          <p className="text-[12px] text-slate-400 mb-3">
            Add 4 approach cards in total. Each card needs bilingual title,
            body, and bullet lists.
          </p>
          <FieldError message={fieldErrors.approachCards} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.approachCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Card #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem("approachCards", idx)}
                    className="text-red-400 hover:text-red-600 text-[11px] font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <input
                  className={fieldInputCls(
                    Boolean(fieldErrors[`approachCards.${idx}.titleEn`]),
                  )}
                  placeholder="Title (EN)"
                  value={card.titleEn}
                  onChange={(e) =>
                    updateItem<ApproachCard>("approachCards", idx, {
                      titleEn: e.target.value,
                    })
                  }
                />
                <FieldError
                  message={fieldErrors[`approachCards.${idx}.titleEn`]}
                />
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                  <div>
                    <input
                      className={fieldInputCls(
                        Boolean(fieldErrors[`approachCards.${idx}.titleAr`]),
                      )}
                      placeholder="Title (AR)"
                      dir="rtl"
                      value={card.titleAr ?? ""}
                      onChange={(e) =>
                        updateItem<ApproachCard>("approachCards", idx, {
                          titleAr: e.target.value,
                        })
                      }
                    />
                    <FieldError
                      message={fieldErrors[`approachCards.${idx}.titleAr`]}
                    />
                  </div>
                </div>
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                      Body (EN)
                    </label>
                    <textarea
                      className={fieldTextareaCls(
                        Boolean(fieldErrors[`approachCards.${idx}.bodyEn`]),
                      )}
                      rows={4}
                      value={card.bodyEn}
                      onChange={(e) =>
                        updateItem<ApproachCard>("approachCards", idx, {
                          bodyEn: e.target.value,
                        })
                      }
                    />
                    <FieldError
                      message={fieldErrors[`approachCards.${idx}.bodyEn`]}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                      Body (AR)
                    </label>
                    <textarea
                      className={fieldTextareaCls(
                        Boolean(fieldErrors[`approachCards.${idx}.bodyAr`]),
                      )}
                      rows={4}
                      dir="rtl"
                      value={card.bodyAr ?? ""}
                      onChange={(e) =>
                        updateItem<ApproachCard>("approachCards", idx, {
                          bodyAr: e.target.value,
                        })
                      }
                    />
                    <FieldError
                      message={fieldErrors[`approachCards.${idx}.bodyAr`]}
                    />
                  </div>     
                </div> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                      Bullets (EN)
                    </label>
                    <textarea
                      className={fieldTextareaCls(
                        Boolean(fieldErrors[`approachCards.${idx}.bulletsEn`]),
                      )}
                      rows={4}
                      value={splitLines(card.bulletsEn).join("\n")}
                      onChange={(e) => {
                        const bullets = e.target.value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean);
                        updateItem<ApproachCard>("approachCards", idx, {
                          bulletsEn: bullets,
                        });
                      }}
                      placeholder="Each line becomes a bullet point"
                    />
                    <FieldError
                      message={fieldErrors[`approachCards.${idx}.bulletsEn`]}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                      Bullets (AR)
                    </label>
                    <textarea
                      className={fieldTextareaCls(
                        Boolean(fieldErrors[`approachCards.${idx}.bulletsAr`]),
                      )}
                      rows={4}
                      dir="rtl"
                      value={splitLines(card.bulletsAr).join("\n")}
                      onChange={(e) => {
                        const bullets = e.target.value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean);
                        updateItem<ApproachCard>("approachCards", idx, {
                          bulletsAr: bullets,
                        });
                      }}
                    />
                    <FieldError
                      message={fieldErrors[`approachCards.${idx}.bulletsAr`]}
                    />
                  </div>
                </div>
              </div>
            ))}
            {form.approachCards.length < 4 &&
              Array.from({ length: 4 - form.approachCards.length }).map(
                (_, slot) => (
                  <button
                    key={`approach-add-slot-${slot}`}
                    type="button"
                    onClick={() =>
                      addItem("approachCards", {
                        titleEn: "",
                        titleAr: "",
                        bodyEn: "",
                        bodyAr: "",
                        bulletsEn: [],
                        bulletsAr: [],
                      })
                    }
                    className="min-h-55 rounded-xl border-2 border-dashed border-red-500 bg-red-50/50 hover:bg-red-50 flex flex-col items-center justify-center gap-2 cursor-pointer text-red-600 transition-colors"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="text-[13px] font-semibold">Add Card</span>
                  </button>
                ),
              )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Key Architectural Insight (EN)">
            <textarea
              className={textareaCls}
              rows={3}
              value={form.approachInsightEn}
              onChange={(e) => {
                setField("approachInsightEn", e.target.value);
              }}
              placeholder="During this phase, I gained…"
            />
          </Field>
          <Field label="Key Architectural Insight (AR)">
            <textarea
              className={textareaCls}
              rows={3}
              dir="rtl"
              value={form.approachInsightAr}
              onChange={(e) => setField("approachInsightAr", e.target.value)}
            />
          </Field>
        </div>
      </div>
    );
  }

  function renderLeadership() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Section Body (EN)">
            <textarea
              className={textareaCls}
              rows={3}
              value={form.leadershipBodyEn}
              onChange={(e) => setField("leadershipBodyEn", e.target.value)}
            />
          </Field>
          <Field label="Section Body (AR)">
            <textarea
              className={textareaCls}
              rows={3}
              dir="rtl"
              value={form.leadershipBodyAr}
              onChange={(e) => setField("leadershipBodyAr", e.target.value)}
            />
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Leadership Cards ({form.leadershipCards.length}/4)
            </label>
            {form.leadershipCards.length < 4 && (
              <button
                type="button"
                onClick={() =>
                  addItem("leadershipCards", {
                    iconName: "Users",
                    title: "",
                    body: "",
                  })
                }
                className="relative text-[12px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer border-2 border-red-500 rounded-lg px-3 py-1.5 bg-red-50"
              >
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-600 border-2 border-white" />
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            )}
          </div>
          <p className="text-[12px] text-slate-400 mb-3">
            Add 4 leadership cards in total. Each card needs an icon, title, and
            body.
          </p>
          <FieldError message={fieldErrors.leadershipCards} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.leadershipCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Card #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem("leadershipCards", idx)}
                    className="text-red-400 hover:text-red-600 text-[11px] font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <input
                  className={fieldInputCls(
                    Boolean(fieldErrors[`leadershipCards.${idx}.iconName`]),
                  )}
                  placeholder="Icon (Users, Cpu, GitBranch, ShieldCheck)"
                  value={card.iconName}
                  onChange={(e) =>
                    updateItem<LeadershipCard>("leadershipCards", idx, {
                      iconName: e.target.value,
                    })
                  }
                />
                <FieldError
                  message={fieldErrors[`leadershipCards.${idx}.iconName`]}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      className={fieldInputCls(
                        Boolean(fieldErrors[`leadershipCards.${idx}.titleEn`]),
                      )}
                      placeholder="Title (EN)"
                      value={card.titleEn ?? card.title ?? ""}
                      onChange={(e) =>
                        updateItem<LeadershipCard>("leadershipCards", idx, {
                          titleEn: e.target.value,
                          title: e.target.value,
                        })
                      }
                    />
                    <FieldError
                      message={fieldErrors[`leadershipCards.${idx}.titleEn`]}
                    />
                  </div>
                  <div>
                    <input
                      className={fieldInputCls(
                        Boolean(fieldErrors[`leadershipCards.${idx}.titleAr`]),
                      )}
                      dir="rtl"
                      placeholder="Title (AR)"
                      value={card.titleAr ?? ""}
                      onChange={(e) =>
                        updateItem<LeadershipCard>("leadershipCards", idx, {
                          titleAr: e.target.value,
                        })
                      }
                    />
                    <FieldError
                      message={fieldErrors[`leadershipCards.${idx}.titleAr`]}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <textarea
                      className={fieldTextareaCls(
                        Boolean(fieldErrors[`leadershipCards.${idx}.bodyEn`]),
                      )}
                      rows={2}
                      placeholder="Body (EN)"
                      value={card.bodyEn ?? card.body ?? ""}
                      onChange={(e) =>
                        updateItem<LeadershipCard>("leadershipCards", idx, {
                          bodyEn: e.target.value,
                          body: e.target.value,
                        })
                      }
                    />
                    <FieldError
                      message={fieldErrors[`leadershipCards.${idx}.bodyEn`]}
                    />
                  </div>
                  <div>
                    <textarea
                      className={fieldTextareaCls(
                        Boolean(fieldErrors[`leadershipCards.${idx}.bodyAr`]),
                      )}
                      rows={2}
                      dir="rtl"
                      placeholder="Body (AR)"
                      value={card.bodyAr ?? ""}
                      onChange={(e) =>
                        updateItem<LeadershipCard>("leadershipCards", idx, {
                          bodyAr: e.target.value,
                        })
                      }
                    />
                    <FieldError
                      message={fieldErrors[`leadershipCards.${idx}.bodyAr`]}
                    />
                  </div>
                </div>
              </div>
            ))}
            {form.leadershipCards.length < 4 &&
              Array.from({ length: 4 - form.leadershipCards.length }).map(
                (_, slot) => (
                  <button
                    key={`leadership-add-slot-${slot}`}
                    type="button"
                    onClick={() =>
                      addItem("leadershipCards", {
                        iconName: "Users",
                        title: "",
                        body: "",
                      })
                    }
                    className="min-h-55 rounded-xl border-2 border-dashed border-red-500 bg-red-50/50 hover:bg-red-50 flex flex-col items-center justify-center gap-2 cursor-pointer text-red-600 transition-colors"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="text-[13px] font-semibold">Add Card</span>
                  </button>
                ),
              )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Banner Stat (EN)">
            <input
              className={inputCls}
              value={form.leadershipBannerStatEn}
              onChange={(e) =>
                setField("leadershipBannerStatEn", e.target.value)
              }
              placeholder="100% On Schedule"
            />
          </Field>
          <Field label="Banner Stat (AR)">
            <input
              className={inputCls}
              dir="rtl"
              value={form.leadershipBannerStatAr}
              onChange={(e) =>
                setField("leadershipBannerStatAr", e.target.value)
              }
              placeholder="%100 في الموعد"
            />
          </Field>
        </div>
      </div>
    );
  }

  function renderSolution() {
    const colorOptions: SolutionCard["color"][] = [
      "green",
      "blue",
      "orange",
      "purple",
    ];
    const colorStyles: Record<SolutionCard["color"], string> = {
      green: "bg-emerald-50 text-emerald-700 border-emerald-200",
      blue: "bg-sky-50 text-sky-700 border-sky-200",
      orange: "bg-amber-50 text-amber-700 border-amber-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Section Body (EN)">
            <textarea
              className={textareaCls}
              rows={3}
              value={form.solutionBodyEn}
              onChange={(e) => setField("solutionBodyEn", e.target.value)}
            />
          </Field>
          <Field label="Section Body (AR)">
            <textarea
              className={textareaCls}
              rows={3}
              dir="rtl"
              value={form.solutionBodyAr}
              onChange={(e) => setField("solutionBodyAr", e.target.value)}
            />
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Feature Cards ({form.solutionCards.length}/4)
            </label>
            {form.solutionCards.length < 4 && (
              <button
                type="button"
                onClick={() =>
                  addItem("solutionCards", {
                    color: "green",
                    tagEn: "",
                    tagAr: "",
                    titleEn: "",
                    titleAr: "",
                    bodyEn: "",
                    bodyAr: "",
                  })
                }
                className="relative text-[12px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer border-2 border-red-500 rounded-lg px-3 py-1.5 bg-red-50"
              >
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-600 border-2 border-white" />
                <Plus className="w-3.5 h-3.5" /> Add Card
              </button>
            )}
          </div>
          <p className="text-[12px] text-slate-400 mb-3">
            Add 4 feature cards in total. Each card needs tag, title, and body
            in EN and AR.
          </p>
          <FieldError message={fieldErrors.solutionCards} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.solutionCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          updateItem<SolutionCard>("solutionCards", idx, {
                            color: c,
                          })
                        }
                        className={`px-3 py-1 rounded-lg text-[12px] font-semibold border cursor-pointer transition-all capitalize ${
                          card.color === c
                            ? `ring-2 ring-[#38BDF8] ${colorStyles[c]}`
                            : `border-slate-200 bg-white text-slate-500 hover:${colorStyles[c]}`
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem("solutionCards", idx)}
                    className="text-red-400 hover:text-red-600 text-[11px] font-semibold cursor-pointer self-start sm:self-auto"
                  >
                    Remove
                  </button>
                </div>
                <input
                  className={fieldInputCls(
                    Boolean(fieldErrors[`solutionCards.${idx}.tagEn`]),
                  )}
                  placeholder="Tag (EN)"
                  value={card.tagEn ?? card.tag ?? ""}
                  onChange={(e) =>
                    updateItem<SolutionCard>("solutionCards", idx, {
                      tagEn: e.target.value,
                    })
                  }
                />
                <FieldError
                  message={fieldErrors[`solutionCards.${idx}.tagEn`]}
                />
                <input
                  className={fieldInputCls(
                    Boolean(fieldErrors[`solutionCards.${idx}.tagAr`]),
                  )}
                  dir="rtl"
                  placeholder="Tag (AR)"
                  value={card.tagAr ?? ""}
                  onChange={(e) =>
                    updateItem<SolutionCard>("solutionCards", idx, {
                      tagAr: e.target.value,
                    })
                  }
                />
                <FieldError
                  message={fieldErrors[`solutionCards.${idx}.tagAr`]}
                />
                <input
                  className={fieldInputCls(
                    Boolean(fieldErrors[`solutionCards.${idx}.titleEn`]),
                  )}
                  placeholder="Title (EN)"
                  value={card.titleEn ?? card.title ?? ""}
                  onChange={(e) =>
                    updateItem<SolutionCard>("solutionCards", idx, {
                      titleEn: e.target.value,
                    })
                  }
                />
                <FieldError
                  message={fieldErrors[`solutionCards.${idx}.titleEn`]}
                />
                <input
                  className={fieldInputCls(
                    Boolean(fieldErrors[`solutionCards.${idx}.titleAr`]),
                  )}
                  dir="rtl"
                  placeholder="Title (AR)"
                  value={card.titleAr ?? ""}
                  onChange={(e) =>
                    updateItem<SolutionCard>("solutionCards", idx, {
                      titleAr: e.target.value,
                    })
                  }
                />
                <FieldError
                  message={fieldErrors[`solutionCards.${idx}.titleAr`]}
                />
                <textarea
                  className={fieldTextareaCls(
                    Boolean(fieldErrors[`solutionCards.${idx}.bodyEn`]),
                  )}
                  rows={2}
                  placeholder="Body Text (EN)"
                  value={card.bodyEn ?? card.body ?? ""}
                  onChange={(e) =>
                    updateItem<SolutionCard>("solutionCards", idx, {
                      bodyEn: e.target.value,
                    })
                  }
                />
                <FieldError
                  message={fieldErrors[`solutionCards.${idx}.bodyEn`]}
                />
                <textarea
                  className={fieldTextareaCls(
                    Boolean(fieldErrors[`solutionCards.${idx}.bodyAr`]),
                  )}
                  rows={2}
                  dir="rtl"
                  placeholder="Body Text (AR)"
                  value={card.bodyAr ?? ""}
                  onChange={(e) =>
                    updateItem<SolutionCard>("solutionCards", idx, {
                      bodyAr: e.target.value,
                    })
                  }
                />
                <FieldError
                  message={fieldErrors[`solutionCards.${idx}.bodyAr`]}
                />
              </div>
            ))}
            {form.solutionCards.length < 4 &&
              Array.from({ length: 4 - form.solutionCards.length }).map(
                (_, slot) => (
                  <button
                    key={`solution-add-slot-${slot}`}
                    type="button"
                    onClick={() =>
                      addItem("solutionCards", {
                        color: "green",
                        tagEn: "",
                        tagAr: "",
                        titleEn: "",
                        titleAr: "",
                        bodyEn: "",
                        bodyAr: "",
                      })
                    }
                    className="min-h-55 rounded-xl border-2 border-dashed border-red-500 bg-red-50/50 hover:bg-red-50 flex flex-col items-center justify-center gap-2 cursor-pointer text-red-600 transition-colors"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="text-[13px] font-semibold">Add Card</span>
                  </button>
                ),
              )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
            Architecture Section
          </p>
          <div className="space-y-4">
            {/* Architecture diagram image upload */}
            <ImageUpload
              label="Architecture Diagram Image"
              value={form.solutionArchImageUrl}
              onChange={(url) => setField("solutionArchImageUrl", url)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Architecture Title (EN)">
                <input
                  className={inputCls}
                  value={form.solutionArchTitleEn}
                  onChange={(e) =>
                    setField("solutionArchTitleEn", e.target.value)
                  }
                />
              </Field>
              <Field label="Architecture Title (AR)">
                <input
                  className={inputCls}
                  dir="rtl"
                  value={form.solutionArchTitleAr}
                  onChange={(e) =>
                    setField("solutionArchTitleAr", e.target.value)
                  }
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Architecture Body (EN)">
                <textarea
                  className={textareaCls}
                  rows={3}
                  value={form.solutionArchBodyEn}
                  onChange={(e) =>
                    setField("solutionArchBodyEn", e.target.value)
                  }
                />
              </Field>
              <Field label="Architecture Body (AR)">
                <textarea
                  className={textareaCls}
                  rows={3}
                  dir="rtl"
                  value={form.solutionArchBodyAr}
                  onChange={(e) =>
                    setField("solutionArchBodyAr", e.target.value)
                  }
                />
              </Field>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderOutcome() {
    const colorOptions: OutcomeItem["color"][] = ["emerald", "purple", "amber"];
    const colorStyles: Record<OutcomeItem["color"], string> = {
      emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      amber: "bg-amber-50 text-amber-700 border-amber-200",
    };

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Outcome Items ({form.outcomeItems.length}/3)
            </label>
            {form.outcomeItems.length < 3 && (
              <button
                type="button"
                onClick={() =>
                  addItem("outcomeItems", {
                    color: "emerald",
                    textEn: "",
                    textAr: "",
                  })
                }
                className="relative text-[12px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer border-2 border-red-500 rounded-lg px-3 py-1.5 bg-red-50"
              >
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-600 border-2 border-white" />
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            )}
          </div>
          <p className="text-[12px] text-slate-400 mb-3">
            Add 3 outcome items in total. Each item needs outcome text in EN and
            AR.
          </p>
          <FieldError message={fieldErrors.outcomeItems} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.outcomeItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          updateItem<OutcomeItem>("outcomeItems", idx, {
                            color: c,
                          })
                        }
                        className={`px-3 py-1 rounded-lg text-[12px] font-semibold border cursor-pointer transition-all capitalize ${
                          item.color === c
                            ? `ring-2 ring-[#38BDF8] ${colorStyles[c]}`
                            : "border-slate-200 bg-white text-slate-500"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem("outcomeItems", idx)}
                    className="text-red-400 hover:text-red-600 text-[11px] font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <textarea
                      className={fieldTextareaCls(
                        Boolean(fieldErrors[`outcomeItems.${idx}.textEn`]),
                      )}
                      rows={3}
                      placeholder="Body Text (EN)"
                      value={item.textEn ?? item.text ?? ""}
                      onChange={(e) =>
                        updateItem<OutcomeItem>("outcomeItems", idx, {
                          textEn: e.target.value,
                        })
                      }
                    />
                    <FieldError
                      message={fieldErrors[`outcomeItems.${idx}.textEn`]}
                    />
                  </div>
                  <div>
                    <textarea
                      className={fieldTextareaCls(
                        Boolean(fieldErrors[`outcomeItems.${idx}.textAr`]),
                      )}
                      rows={3}
                      dir="rtl"
                      placeholder="Body Text (AR)"
                      value={item.textAr ?? ""}
                      onChange={(e) =>
                        updateItem<OutcomeItem>("outcomeItems", idx, {
                          textAr: e.target.value,
                        })
                      }
                    />
                    <FieldError
                      message={fieldErrors[`outcomeItems.${idx}.textAr`]}
                    />
                  </div>
                </div>
              </div>
            ))}
            {form.outcomeItems.length < 3 &&
              Array.from({ length: 3 - form.outcomeItems.length }).map(
                (_, slot) => (
                  <button
                    key={`outcome-add-slot-${slot}`}
                    type="button"
                    onClick={() =>
                      addItem("outcomeItems", {
                        color: "emerald",
                        textEn: "",
                        textAr: "",
                      })
                    }
                    className="min-h-55 rounded-xl border-2 border-dashed border-red-500 bg-red-50/50 hover:bg-red-50 flex flex-col items-center justify-center gap-2 cursor-pointer text-red-600 transition-colors"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="text-[13px] font-semibold">Add Item</span>
                  </button>
                ),
              )}
          </div>
        </div>

        {/* Recognition image upload */}
        <ImageUpload
          label="Recognition / Award Image"
          value={form.recognitionImageUrl}
          onChange={(url) => setField("recognitionImageUrl", url)}
        />

        <Field label="Recognition Label">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                className={inputCls}
                value={form.recognitionLabelEn}
                onChange={(e) => setField("recognitionLabelEn", e.target.value)}
                placeholder="Recognition Label (EN)"
              />
              <FieldError message={fieldErrors.recognitionLabelEn} />
            </div>
            <div>
              <input
                className={inputCls}
                dir="rtl"
                value={form.recognitionLabelAr}
                onChange={(e) => setField("recognitionLabelAr", e.target.value)}
                placeholder="Recognition Label (AR)"
              />
              <FieldError message={fieldErrors.recognitionLabelAr} />
            </div>
          </div>
        </Field>

        <Field label="Architecture Label">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              className={inputCls}
              value={form.solutionArchLabelEn}
              onChange={(e) => setField("solutionArchLabelEn", e.target.value)}
              placeholder="ENTERPRISE ECOSYSTEM INTEGRATION"
            />
            <input
              className={inputCls}
              dir="rtl"
              value={form.solutionArchLabelAr}
              onChange={(e) => setField("solutionArchLabelAr", e.target.value)}
              placeholder="تكامل النظام البيئي للمؤسسة"
            />
          </div>
        </Field>
      </div>
    );
  }

  function renderSkills() {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Skill Cards ({form.skillCards.length}/7)
          </label>
          {form.skillCards.length < 7 && (
            <button
              type="button"
              onClick={() =>
                addItem("skillCards", {
                  num: String(form.skillCards.length + 1),
                  categoryEn: "",
                  categoryAr: "",
                  titleEn: "",
                  titleAr: "",
                  bodyEn: "",
                  bodyAr: "",
                })
              }
              className="relative text-[12px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer border-2 border-red-500 rounded-lg px-3 py-1.5 bg-red-50"
            >
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-600 border-2 border-white" />
              <Plus className="w-3.5 h-3.5" /> Add Skill
            </button>
          )}
        </div>
        <p className="text-[12px] text-slate-400 -mt-2">
          Add 7 skill cards in total. Each card needs a number, category, title,
          and description.
        </p>
        <FieldError message={fieldErrors.skillCards} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.skillCards.map((sk, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Skill #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem("skillCards", idx)}
                  className="text-red-400 hover:text-red-600 text-[11px] font-semibold cursor-pointer"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    className={fieldInputCls(
                      Boolean(fieldErrors[`skillCards.${idx}.num`]),
                    )}
                    placeholder="Number"
                    value={sk.num}
                    onChange={(e) =>
                      updateItem<SkillCard>("skillCards", idx, {
                        num: e.target.value,
                      })
                    }
                  />
                  <FieldError message={fieldErrors[`skillCards.${idx}.num`]} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    className={fieldInputCls(
                      Boolean(fieldErrors[`skillCards.${idx}.categoryEn`]),
                    )}
                    placeholder="Category (EN)"
                    value={sk.categoryEn ?? sk.category ?? ""}
                    onChange={(e) =>
                      updateItem<SkillCard>("skillCards", idx, {
                        categoryEn: e.target.value,
                      })
                    }
                  />
                  <FieldError
                    message={fieldErrors[`skillCards.${idx}.categoryEn`]}
                  />
                </div>
                <div>
                  <input
                    className={fieldInputCls(
                      Boolean(fieldErrors[`skillCards.${idx}.categoryAr`]),
                    )}
                    dir="rtl"
                    placeholder="الفئة (AR)"
                    value={sk.categoryAr ?? sk.category ?? ""}
                    onChange={(e) =>
                      updateItem<SkillCard>("skillCards", idx, {
                        categoryAr: e.target.value,
                      })
                    }
                  />
                  <FieldError
                    message={fieldErrors[`skillCards.${idx}.categoryAr`]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    className={fieldInputCls(
                      Boolean(fieldErrors[`skillCards.${idx}.titleEn`]),
                    )}
                    placeholder="Skill Title (EN)"
                    value={sk.titleEn ?? sk.title ?? ""}
                    onChange={(e) =>
                      updateItem<SkillCard>("skillCards", idx, {
                        titleEn: e.target.value,
                      })
                    }
                  />
                  <FieldError
                    message={fieldErrors[`skillCards.${idx}.titleEn`]}
                  />
                </div>
                <div>
                  <input
                    className={fieldInputCls(
                      Boolean(fieldErrors[`skillCards.${idx}.titleAr`]),
                    )}
                    dir="rtl"
                    placeholder="عنوان المهارة (AR)"
                    value={sk.titleAr ?? sk.title ?? ""}
                    onChange={(e) =>
                      updateItem<SkillCard>("skillCards", idx, {
                        titleAr: e.target.value,
                      })
                    }
                  />
                  <FieldError
                    message={fieldErrors[`skillCards.${idx}.titleAr`]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <textarea
                    className={fieldTextareaCls(
                      Boolean(fieldErrors[`skillCards.${idx}.bodyEn`]),
                    )}
                    rows={2}
                    placeholder="Description (EN)"
                    value={sk.bodyEn ?? sk.body ?? ""}
                    onChange={(e) =>
                      updateItem<SkillCard>("skillCards", idx, {
                        bodyEn: e.target.value,
                      })
                    }
                  />
                  <FieldError
                    message={fieldErrors[`skillCards.${idx}.bodyEn`]}
                  />
                </div>
                <div>
                  <textarea
                    className={fieldTextareaCls(
                      Boolean(fieldErrors[`skillCards.${idx}.bodyAr`]),
                    )}
                    dir="rtl"
                    rows={2}
                    placeholder="الوصف (AR)"
                    value={sk.bodyAr ?? sk.body ?? ""}
                    onChange={(e) =>
                      updateItem<SkillCard>("skillCards", idx, {
                        bodyAr: e.target.value,
                      })
                    }
                  />
                  <FieldError
                    message={fieldErrors[`skillCards.${idx}.bodyAr`]}
                  />
                </div>
              </div>
            </div>
          ))}
          {form.skillCards.length < 7 &&
            Array.from({ length: 7 - form.skillCards.length }).map(
              (_, slot) => (
                <button
                  key={`skill-add-slot-${slot}`}
                  type="button"
                  onClick={() =>
                    addItem("skillCards", {
                      num: String(form.skillCards.length + 1),
                      categoryEn: "",
                      categoryAr: "",
                      titleEn: "",
                      titleAr: "",
                      bodyEn: "",
                      bodyAr: "",
                    })
                  }
                  className="min-h-55 rounded-xl border-2 border-dashed border-red-500 bg-red-50/50 hover:bg-red-50 flex flex-col items-center justify-center gap-2 cursor-pointer text-red-600 transition-colors"
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-[13px] font-semibold">Add Skill</span>
                </button>
              ),
            )}
        </div>
      </div>
    );
  }

  function renderTab() {
    switch (activeTab) {
      case 0:
        return renderOverview();
      case 1:
        return renderChallenge();
      case 2:
        return renderApproach();
      case 3:
        return renderLeadership();
      case 4:
        return renderSolution();
      case 5:
        return renderOutcome();
      case 6:
        return renderSkills();
      default:
        return null;
    }
  }

  if (isFormMode) {
    return (
      <div className="space-y-5 pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
              {editingId ? "Edit Portfolio Item" : "New Portfolio Item"}
            </h1>
            <p className="text-[13px] text-slate-400 mt-0.5">
              Fill out each section to build the full case study page.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13px] font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#20B0F0] text-white text-[13px] font-semibold transition-colors shadow-xs cursor-pointer disabled:opacity-60"
            >
              {saving ? "Saving…" : editingId ? "Save Changes" : "Create Item"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
          {/* ── Tab Bar ── */}
          <div className="flex overflow-x-auto border-b border-slate-100 scrollbar-hide">
            {TABS.map((tab, idx) => {
              const unlocked = isPortfolioStepUnlocked(form, idx);
              const complete = isPortfolioStepComplete(form, idx);
              const locked = !unlocked;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => goToTab(idx)}
                  disabled={locked}
                  className={`flex items-center gap-1.5 px-3 sm:px-5 py-3 sm:py-3.5 text-[13px] font-semibold whitespace-nowrap transition-colors border-b-2 shrink-0 ${
                    locked
                      ? "border-transparent text-slate-400 cursor-not-allowed"
                      : activeTab === idx
                        ? "border-[#38BDF8] text-[#38BDF8] bg-sky-50/60 cursor-pointer"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 cursor-pointer"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      locked
                        ? "bg-slate-100 text-slate-400"
                        : complete
                          ? activeTab === idx
                            ? "bg-[#38BDF8] text-white"
                            : "bg-emerald-500 text-white"
                          : activeTab === idx
                            ? "bg-[#38BDF8] text-white"
                            : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {locked ? (
                      <Lock className="w-3 h-3" />
                    ) : complete ? (
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <span className="hidden sm:inline text-[13px]">{tab}</span>
                </button>
              );
            })}
          </div>

          {/* ── Tab Content ── */}
          <div className="p-4 sm:p-6">{renderTab()}</div>

          {/* ── Tab Navigation Footer ── */}
          <div className="px-4 sm:px-6 pb-5 pt-4 flex items-center justify-between border-t border-slate-50">
            <button
              type="button"
              onClick={() => setActiveTab((t) => Math.max(0, t - 1))}
              disabled={activeTab === 0}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13px] font-semibold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {activeTab + 1} of {TABS.length} — {TABS[activeTab]}
            </span>
            {activeTab < TABS.length - 1 ? (
              <button
                type="button"
                onClick={goToNextStep}
                disabled={!isPortfolioStepComplete(form, activeTab)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-slate-100"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#20B0F0] text-white text-[13px] font-semibold transition-colors cursor-pointer disabled:opacity-60"
              >
                {saving
                  ? "Saving…"
                  : editingId
                    ? "Save Changes"
                    : "Create Item"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight">
            Portfolio
          </h1>
          <p className="text-[13.5px] text-slate-500 mt-0.5">
            Manage portfolio projects and case studies.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#38BDF8] hover:bg-[#20B0F0] text-white rounded-sm px-5 py-2.5 text-[13.5px] font-semibold transition-colors shadow-xs self-start sm:self-auto cursor-pointer font-sans"
        >
          <Plus className="w-4 h-4" />
          New Item
        </button>
      </div>

      {loadError && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-[13px] font-medium">
          {loadError}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse"
            >
              <div className="bg-slate-100 rounded-xl aspect-video mb-4" />
              <div className="h-4 bg-slate-100 rounded mb-2 w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
              <div className="h-9 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 sm:p-16 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-500 font-semibold mb-1">
            No portfolio items yet
          </p>
          <p className="text-slate-400 text-[13px] mb-5">
            Create your first case study to get started.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-[#38BDF8] text-white rounded-sm px-5 py-2.5 text-[13.5px] font-semibold cursor-pointer hover:bg-[#20B0F0] transition-colors font-sans"
          >
            <Plus className="w-4 h-4" /> Create First Item
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {paginatedItems.map((item) => {
              const cover = item.heroImageUrl || item.media?.url;
              return (
                <AdminContentCard
                  key={item.id}
                  title={item.titleEn || "Untitled"}
                  description={item.excerptEn}
                  imageUrl={cover}
                  imageAlt={item.titleEn || "Portfolio item"}
                  imageAspectClass="aspect-video"
                  imageFallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    </div>
                  }
                  imageOverlay={
                    <>
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white text-slate-800 shadow-xs">
                        {item.tag || "Portfolio"}
                      </span>
                      {!item.published && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-slate-300">
                          Draft
                        </span>
                      )}
                    </>
                  }
                  onEdit={() => openEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              );
            })}
          </div>

          <AdminPaginationBar
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
            itemLabel="portfolio items"
          />
        </div>
      )}
    </div>
  );
}
