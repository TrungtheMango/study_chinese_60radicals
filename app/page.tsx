"use client";
// @ts-nocheck

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  KeyRound,
  RefreshCcw,
  Settings,
  Sparkles,
  Timer,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

/**
 * DATASET: 60 radicals
 * Columns:
 * 1) vn: Tên bộ thủ tiếng Việt
 * 2) radical: Bộ thủ
 * 3) pinyin: Tên bộ thủ pinyin
 * 4) meaning: Ý nghĩa (dễ nhớ, thông dụng)
 * 5) mnemonic: Mẹo nhớ theo tượng hình
 * 6) examples: Ví dụ (từ thường gặp)
 */
const RADICALS = [
  {
    id: 1,
    vn: "Nhân",
    radical: "人 / 亻",
    pinyin: "rén",
    meaning: "con người; việc liên quan người",
    mnemonic: "nhìn như người đang đứng",
    examples: ["你", "他", "住", "作", "休"],
  },
  {
    id: 2,
    vn: "Khẩu",
    radical: "口",
    pinyin: "kǒu",
    meaning: "miệng; nói; ăn uống",
    mnemonic: "cái miệng vuông đang mở",
    examples: ["吃", "喝", "問", "叫", "呢"],
  },
  {
    id: 3,
    vn: "Đao",
    radical: "刀 / 刂",
    pinyin: "dāo",
    meaning: "dao; cắt; xử lý",
    mnemonic: "lưỡi dao có tay cầm",
    examples: ["到", "別", "利", "刻", "刪"],
  },
  {
    id: 4,
    vn: "Lực",
    radical: "力",
    pinyin: "lì",
    meaning: "sức; lực; cố gắng",
    mnemonic: "cánh tay đang gồng",
    examples: ["動", "努", "加", "助", "勞"],
  },
  {
    id: 5,
    vn: "Thổ",
    radical: "土",
    pinyin: "tǔ",
    meaning: "đất; nền; địa phương",
    mnemonic: "mặt đất + cọc đứng",
    examples: ["地", "在", "城", "場", "境"],
  },
  {
    id: 6,
    vn: "Đại",
    radical: "大",
    pinyin: "dà",
    meaning: "to; lớn",
    mnemonic: "người dang tay chân thật rộng",
    examples: ["天", "太", "夫", "央", "奇"],
  },
  {
    id: 7,
    vn: "Nữ",
    radical: "女",
    pinyin: "nǚ",
    meaning: "phụ nữ; nữ",
    mnemonic: "người phụ nữ ngồi",
    examples: ["好", "媽", "姐", "妹", "姓"],
  },
  {
    id: 8,
    vn: "Tử",
    radical: "子",
    pinyin: "zǐ",
    meaning: "con; trẻ em",
    mnemonic: "em bé dang tay",
    examples: ["字", "孩", "孔", "孫", "學"],
  },
  {
    id: 9,
    vn: "Miên",
    radical: "宀",
    pinyin: "mián",
    meaning: "mái nhà; trong nhà",
    mnemonic: "mái che phía trên",
    examples: ["家", "安", "室", "客", "宿"],
  },
  {
    id: 10,
    vn: "Sơn",
    radical: "山",
    pinyin: "shān",
    meaning: "núi",
    mnemonic: "ba đỉnh núi",
    examples: ["出", "島", "岩", "峰", "岸"],
  },
  {
    id: 11,
    vn: "Nhật",
    radical: "日",
    pinyin: "rì",
    meaning: "mặt trời; ngày",
    mnemonic: "mặt trời hình ô vuông",
    examples: ["明", "時", "早", "晚", "星"],
  },
  {
    id: 12,
    vn: "Nguyệt",
    radical: "月",
    pinyin: "yuè",
    meaning: "mặt trăng; tháng (đôi khi gợi bộ phận cơ thể)",
    mnemonic: "mặt trăng cong",
    examples: ["服", "期", "朋", "腦", "腳"],
  },
  {
    id: 13,
    vn: "Mộc",
    radical: "木",
    pinyin: "mù",
    meaning: "cây; gỗ",
    mnemonic: "thân cây + cành",
    examples: ["林", "森", "桌", "校", "杯"],
  },
  {
    id: 14,
    vn: "Thủy",
    radical: "水 / 氵",
    pinyin: "shuǐ",
    meaning: "nước; chất lỏng",
    mnemonic: "dòng nước chảy",
    examples: ["河", "海", "洗", "酒", "游"],
  },
  {
    id: 15,
    vn: "Hỏa",
    radical: "火 / 灬",
    pinyin: "huǒ",
    meaning: "lửa; nóng; nấu",
    mnemonic: "ngọn lửa bốc lên",
    examples: ["熱", "燈", "煮", "然", "煙"],
  },
  {
    id: 16,
    vn: "Ngưu",
    radical: "牛",
    pinyin: "niú",
    meaning: "trâu/bò",
    mnemonic: "đầu bò có sừng",
    examples: ["物", "特", "牽", "牧", "犧"],
  },
  {
    id: 17,
    vn: "Khuyển",
    radical: "犬 / 犭",
    pinyin: "quǎn",
    meaning: "chó; thú",
    mnemonic: "con chó có đuôi",
    examples: ["狗", "獨", "獎", "猶", "獵"],
  },
  {
    id: 18,
    vn: "Điền",
    radical: "田",
    pinyin: "tián",
    meaning: "ruộng; ô/khu",
    mnemonic: "ruộng chia 4 ô",
    examples: ["男", "界", "留", "當", "畫"],
  },
  {
    id: 19,
    vn: "Mục",
    radical: "目",
    pinyin: "mù",
    meaning: "mắt; nhìn",
    mnemonic: "con mắt có đồng tử",
    examples: ["看", "相", "眼", "直", "睡"],
  },
  {
    id: 20,
    vn: "Thạch",
    radical: "石",
    pinyin: "shí",
    meaning: "đá; cứng; khoáng",
    mnemonic: "hòn đá dưới chân núi",
    examples: ["硬", "破", "碗", "礦", "碼"],
  },
  {
    id: 21,
    vn: "Hòa",
    radical: "禾",
    pinyin: "hé",
    meaning: "lúa; mùa vụ",
    mnemonic: "bông lúa có hạt",
    examples: ["秋", "種", "科", "稅", "穩"],
  },
  {
    id: 22,
    vn: "Trúc",
    radical: "竹 / ⺮",
    pinyin: "zhú",
    meaning: "tre; đồ tre; bút/sách",
    mnemonic: "hai thân tre song song",
    examples: ["筆", "笑", "等", "箱", "簡"],
  },
  {
    id: 23,
    vn: "Mễ",
    radical: "米",
    pinyin: "mǐ",
    meaning: "gạo; hạt; bột",
    mnemonic: "hạt gạo tỏa ra",
    examples: ["粉", "糖", "精", "糧", "粥"],
  },
  {
    id: 24,
    vn: "Thảo",
    radical: "艸 / 艹",
    pinyin: "cǎo",
    meaning: "cỏ; thảo mộc",
    mnemonic: "cỏ mọc trên đầu chữ",
    examples: ["花", "茶", "菜", "藥", "草"],
  },
  {
    id: 25,
    vn: "Trùng",
    radical: "虫",
    pinyin: "chóng",
    meaning: "côn trùng; sâu",
    mnemonic: "con sâu có đầu",
    examples: ["蛇", "蝦", "蜂", "蚊", "蛋"],
  },
  {
    id: 26,
    vn: "Y",
    radical: "衣 / 衤",
    pinyin: "yī",
    meaning: "quần áo; mặc",
    mnemonic: "áo choàng phủ người",
    examples: ["被", "褲", "裙", "裝", "補"],
  },
  {
    id: 27,
    vn: "Ngôn",
    radical: "言 / 訁",
    pinyin: "yán",
    meaning: "lời nói; ngôn ngữ",
    mnemonic: "miệng phát ra lời",
    examples: ["話", "說", "謝", "請", "認"],
  },
  {
    id: 28,
    vn: "Tâm",
    radical: "心 / 忄",
    pinyin: "xīn",
    meaning: "tim; cảm xúc; nghĩ",
    mnemonic: "trái tim 3 nhịp",
    examples: ["想", "忙", "快", "愛", "情"],
  },
  {
    id: 29,
    vn: "Bối",
    radical: "貝",
    pinyin: "bèi",
    meaning: "tiền; của cải",
    mnemonic: "vỏ sò cổ đại = tiền",
    examples: ["買", "貴", "財", "費", "貿"],
  },
  {
    id: 30,
    vn: "Túc",
    radical: "足 / ⻊",
    pinyin: "zú",
    meaning: "chân; đi; đủ",
    mnemonic: "bàn chân bước đi",
    examples: ["路", "跑", "跟", "距", "跳"],
  },
  {
    id: 31,
    vn: "Xa",
    radical: "車",
    pinyin: "chē",
    meaning: "xe; phương tiện",
    mnemonic: "khung xe + bánh",
    examples: ["開", "軍", "轉", "輪", "輕"],
  },
  {
    id: 32,
    vn: "Sước",
    radical: "辶",
    pinyin: "chuò",
    meaning: "đi lại; đường; đến",
    mnemonic: "đường cong + bước",
    examples: ["這", "進", "近", "遠", "還"],
  },
  {
    id: 33,
    vn: "Ấp",
    radical: "邑 / 阝(phải)",
    pinyin: "yì",
    meaning: "làng/thành; nơi chốn",
    mnemonic: "khu dân cư có tường",
    examples: ["都", "郵", "郊", "鄉", "鄰"],
  },
  {
    id: 34,
    vn: "Phụ",
    radical: "阜 / 阝(trái)",
    pinyin: "fù",
    meaning: "gò/đồi; bậc",
    mnemonic: "bậc thềm/đống đất",
    examples: ["陸", "階", "降", "隊", "陽"],
  },
  {
    id: 35,
    vn: "Kim",
    radical: "金",
    pinyin: "jīn",
    meaning: "kim loại; vàng",
    mnemonic: "kim loại lấp lánh",
    examples: ["錢", "銀", "鐵", "鐘", "銷"],
  },
  {
    id: 36,
    vn: "Môn",
    radical: "門",
    pinyin: "mén",
    meaning: "cửa; cổng",
    mnemonic: "hai cánh cửa",
    examples: ["開", "間", "聞", "閃", "閉"],
  },
  {
    id: 37,
    vn: "Vũ",
    radical: "雨",
    pinyin: "yǔ",
    meaning: "mưa; thời tiết",
    mnemonic: "mây + giọt mưa",
    examples: ["雪", "雷", "雲", "霧", "露"],
  },
  {
    id: 38,
    vn: "Thực",
    radical: "食 / 飠",
    pinyin: "shí",
    meaning: "ăn; thức ăn",
    mnemonic: "miệng + đồ ăn",
    examples: ["飯", "餓", "館", "飲", "餅"],
  },
  {
    id: 39,
    vn: "Mã",
    radical: "馬",
    pinyin: "mǎ",
    meaning: "ngựa",
    mnemonic: "ngựa có bờm",
    examples: ["騎", "驚", "駕", "驗", "驛"],
  },
  {
    id: 40,
    vn: "Ngư",
    radical: "魚",
    pinyin: "yú",
    meaning: "cá",
    mnemonic: "cá có vây",
    examples: ["鮮", "鯨", "鰻", "鱗", "魯"],
  },
  {
    id: 41,
    vn: "Điểu",
    radical: "鳥",
    pinyin: "niǎo",
    meaning: "chim",
    mnemonic: "chim có mỏ",
    examples: ["鳴", "鴨", "雞", "鷹", "鴿"],
  },
  {
    id: 42,
    vn: "Quảng",
    radical: "广",
    pinyin: "guǎng",
    meaning: "mái che; tòa nhà",
    mnemonic: "mái nghiêng",
    examples: ["店", "床", "庫", "廳", "府"],
  },
  {
    id: 43,
    vn: "Hiệt",
    radical: "頁",
    pinyin: "yè",
    meaning: "đầu; mặt",
    mnemonic: "đầu người nghiêng",
    examples: ["顏", "額", "順", "題", "頭"],
  },
  {
    id: 44,
    vn: "Công",
    radical: "工",
    pinyin: "gōng",
    meaning: "công việc; kỹ thuật",
    mnemonic: "khung dụng cụ",
    examples: ["作", "功", "江", "紅", "巧"],
  },
  {
    id: 45,
    vn: "Phộc",
    radical: "攴 / 攵",
    pinyin: "pū",
    meaning: "đánh/tác động; sửa đổi",
    mnemonic: "tay cầm que gõ",
    examples: ["改", "教", "收", "攻", "政"],
  },
  {
    id: 46,
    vn: "Thị",
    radical: "示 / 礻",
    pinyin: "shì",
    meaning: "lễ; thờ; phúc",
    mnemonic: "bàn thờ nhỏ",
    examples: ["神", "福", "祝", "禮", "祖"],
  },
  {
    id: 47,
    vn: "Ty",
    radical: "糸 / 糹",
    pinyin: "mì",
    meaning: "sợi; dệt; liên kết",
    mnemonic: "cuộn chỉ",
    examples: ["經", "線", "結", "級", "續"],
  },
  {
    id: 48,
    vn: "Tẩu",
    radical: "走",
    pinyin: "zǒu",
    meaning: "đi; chạy",
    mnemonic: "người chạy nghiêng",
    examples: ["起", "超", "赴", "趕", "越"],
  },
  {
    id: 49,
    vn: "Thập",
    radical: "十",
    pinyin: "shí",
    meaning: "mười; dấu cộng",
    mnemonic: "cắt ngang ở giữa",
    examples: ["千", "協", "博", "南", "十"],
  },
  {
    id: 50,
    vn: "Bát",
    radical: "八",
    pinyin: "bā",
    meaning: "tách ra; chia",
    mnemonic: "hai nét tách đôi",
    examples: ["分", "公", "共", "兵", "其"],
  },
  {
    id: 51,
    vn: "Hựu",
    radical: "又",
    pinyin: "yòu",
    meaning: "tay; lại nữa",
    mnemonic: "bàn tay phải",
    examples: ["友", "取", "受", "雙", "反"],
  },
  {
    id: 52,
    vn: "Nhục",
    radical: "肉 / ⺼",
    pinyin: "ròu",
    meaning: "thịt; thân thể",
    mnemonic: "miếng thịt có vân",
    examples: ["肥", "腸", "胃", "腳", "腦"],
  },
  {
    id: 53,
    vn: "Cân",
    radical: "巾",
    pinyin: "jīn",
    meaning: "khăn; vải",
    mnemonic: "khăn treo xuống",
    examples: ["布", "帽", "帆", "帳", "幫"],
  },
  {
    id: 54,
    vn: "Huyệt",
    radical: "穴",
    pinyin: "xué",
    meaning: "hang; lỗ; chỗ trống",
    mnemonic: "mái che + lỗ",
    examples: ["空", "窗", "究", "穿", "窄"],
  },
  {
    id: 55,
    vn: "Phương",
    radical: "方",
    pinyin: "fāng",
    meaning: "hướng; cách; phương",
    mnemonic: "tấm bảng vuông",
    examples: ["房", "旅", "族", "放", "方法"],
  },
  {
    id: 56,
    vn: "Lão",
    radical: "老",
    pinyin: "lǎo",
    meaning: "già; cũ",
    mnemonic: "người già chống gậy",
    examples: ["考", "者", "老師", "孝"],
  },
  {
    id: 57,
    vn: "Thần",
    radical: "辰",
    pinyin: "chén",
    meaning: "buổi sớm; thời điểm",
    mnemonic: "mặt trời vừa nhú",
    examples: ["晨", "農", "辱"],
  },
  {
    id: 58,
    vn: "Cung",
    radical: "弓",
    pinyin: "gōng",
    meaning: "cung; kéo",
    mnemonic: "cây cung cong",
    examples: ["強", "張", "引", "彈"],
  },
  {
    id: 59,
    vn: "Bạch",
    radical: "白",
    pinyin: "bái",
    meaning: "trắng; sáng; rõ",
    mnemonic: "ánh sáng trong ô",
    examples: ["明白", "百", "皆", "皂"],
  },
  {
    id: 60,
    vn: "Hộ",
    radical: "戶",
    pinyin: "hù",
    meaning: "cửa nhà; hộ gia đình",
    mnemonic: "cánh cửa nhìn nghiêng",
    examples: ["所", "房", "扇", "戶口"],
  },
];

// ---- LocalStorage ----
const LS_KEY = "radicals60_progress_v2";

function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function iso(d: Date): string {
  return d.toISOString();
}

function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}


function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}


// Leitner-ish intervals (days)
function intervalByBox(box: number): number {
  if (box <= 1) return 0;
  if (box === 2) return 1;
  if (box === 3) return 3;
  if (box === 4) return 7;
  return 14;
}


type ProgressItem = {
  box: number;
  learned: boolean;
  correct: number;
  wrong: number;
  lastReviewed: string | null;
  due: string;
};

type ProgressState = {
  byId: Record<number, ProgressItem>;
  settings: {
    showExamples: boolean;
    showMnemonic: boolean;
    toneMarks: boolean;
    shuffleLearn: boolean;
    keyboardShortcuts: boolean;
  };
};

function emptyProgress(): ProgressState {
  const base: Record<number, ProgressItem> = {};
  const t = todayStart();

  for (const r of RADICALS) {
    base[r.id] = {
      box: 1,
      learned: false,
      correct: 0,
      wrong: 0,
      lastReviewed: null,
      due: iso(t),
    };
  }

  return {
    byId: base,
    settings: {
      showExamples: true,
      showMnemonic: true,
      toneMarks: true,
      shuffleLearn: false,
      keyboardShortcuts: true,
    },
  };
}


function loadProgress() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.byId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveProgress(state: unknown): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}


function useProgress() {
  const [progress, setProgress] = useState(() => loadProgress() || emptyProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const patchId = (id: number, patch: any) => {
    setProgress((p: ProgressState) => ({
      ...p,
      byId: {
        ...p.byId,
        [id]: { ...p.byId[id], ...patch },
      },
    }));
  };

  const patchSettings = (patch: any) => {
    setProgress((p: ProgressState) => ({ ...p, settings: { ...p.settings, ...patch } }));
  };

  const resetAll = () => setProgress(emptyProgress());

  return { progress, patchId, patchSettings, resetAll };
}

const MODE_META = {
  learn: {
    label: "Học",
    chip: "border-sky-200 bg-sky-50 text-sky-700",
    solid: "bg-sky-600 text-white hover:bg-sky-700",
    soft: "bg-sky-50/70",
    ring: "ring-sky-200",
    icon: "text-sky-700",
    dot: "bg-sky-500",
  },
  review: {
    label: "Ôn",
    chip: "border-amber-200 bg-amber-50 text-amber-800",
    solid: "bg-amber-600 text-white hover:bg-amber-700",
    soft: "bg-amber-50/70",
    ring: "ring-amber-200",
    icon: "text-amber-700",
    dot: "bg-amber-500",
  },
  quiz: {
    label: "Kiểm tra",
    chip: "border-violet-200 bg-violet-50 text-violet-700",
    solid: "bg-violet-600 text-white hover:bg-violet-700",
    soft: "bg-violet-50/70",
    ring: "ring-violet-200",
    icon: "text-violet-700",
    dot: "bg-violet-500",
  },
};

function SmallKbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-xl border border-slate-200 bg-white/70 px-2 py-1 text-xs text-slate-600 shadow-sm">
      {children}
    </span>
  );
}


function SettingsDialog({ api }) {
  const { progress, patchSettings, resetAll } = api;
  const s = progress.settings;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="rounded-2xl gap-2 bg-white/70 hover:bg-white">
          <Settings className="h-4 w-4" />
          Cài đặt
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Cài đặt</DialogTitle>
          <DialogDescription>
            Tùy chỉnh hiển thị và phím tắt. Tiến độ lưu trên trình duyệt.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Hiện ví dụ</div>
              <div className="text-xs text-slate-500">Hiện các chữ ví dụ khi lật thẻ.</div>
            </div>
            <Switch checked={s.showExamples} onCheckedChange={(v) => patchSettings({ showExamples: v })} />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Hiện mẹo nhớ</div>
              <div className="text-xs text-slate-500">Bật để thấy mẹo tượng hình.</div>
            </div>
            <Switch checked={s.showMnemonic} onCheckedChange={(v) => patchSettings({ showMnemonic: v })} />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Pinyin có dấu</div>
              <div className="text-xs text-slate-500">Tắt để hiện pinyin không dấu.</div>
            </div>
            <Switch checked={s.toneMarks} onCheckedChange={(v) => patchSettings({ toneMarks: v })} />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Xáo thẻ khi học</div>
              <div className="text-xs text-slate-500">Chế độ Học sẽ random 60 thẻ.</div>
            </div>
            <Switch checked={s.shuffleLearn} onCheckedChange={(v) => patchSettings({ shuffleLearn: v })} />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Phím tắt</div>
              <div className="text-xs text-slate-500">Space lật thẻ, 1–4 chấm điểm.</div>
            </div>
            <Switch checked={s.keyboardShortcuts} onCheckedChange={(v) => patchSettings({ keyboardShortcuts: v })} />
          </div>

          <Separator />

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold">Đặt lại tiến độ</div>
            <div className="mt-1 text-xs text-slate-500">Xóa Box, điểm đúng/sai, trạng thái đã học.</div>
            <Button variant="destructive" className="mt-3 rounded-2xl" onClick={resetAll}>
              Đặt lại
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TopBar({ title, subtitle, right }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="text-xl font-semibold tracking-tight text-slate-900">{title}</div>
        {subtitle && <div className="mt-1 text-sm text-slate-600">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}

function StatChip({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm">
      <span className="text-slate-500">{label}</span>
      <span className="mx-2 text-slate-300">•</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function formatPinyin(r, toneMarks) {
  return toneMarks ? r.pinyin : normalize(r.pinyin);
}

// 1 Again: box=1
// 2 Hard: box stays
// 3 Good: box +1
// 4 Easy: box +2
function applyGrade(currentBox, grade) {
  if (grade === 1) return 1;
  if (grade === 2) return Math.max(1, currentBox);
  if (grade === 3) return Math.min(5, currentBox + 1);
  return Math.min(5, currentBox + 2);
}

function buildDeck({ mode, progress, shuffleLearn }) {
  const idsAll = RADICALS.map((r) => r.id);

  if (mode === "learn") {
    return shuffleLearn ? shuffle(idsAll) : idsAll;
  }

  if (mode === "review") {
    const t = todayStart();
    const due = RADICALS.filter((r) => new Date(progress.byId[r.id]?.due || 0) <= t).map((r) => r.id);
    return due.length ? due : idsAll;
  }

  return shuffle(idsAll);
}

function StudySession({ api, mode, onExit }) {
  const { progress, patchId } = api;
  const settings = progress.settings;
  const theme = MODE_META[mode] || MODE_META.learn;

  const [deck, setDeck] = useState(() => buildDeck({ mode, progress, shuffleLearn: settings.shuffleLearn }));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizChoice, setQuizChoice] = useState(null);
  const [quizReveal, setQuizReveal] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setDeck(buildDeck({ mode, progress, shuffleLearn: settings.shuffleLearn }));
    setIndex(0);
    setFlipped(false);
    setQuizChoice(null);
    setQuizReveal(false);
  }, [mode, settings.shuffleLearn]);

  useEffect(() => {
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, []);

  const id = deck[index] ?? deck[0];
  const card = useMemo(() => RADICALS.find((r) => r.id === id) || RADICALS[0], [id]);
  const pr = progress.byId[card.id] || { box: 1, correct: 0, wrong: 0, due: iso(todayStart()) };

  const total = deck.length || 1;
  const pct = Math.round(((index + 1) / total) * 100);

  const quiz = useMemo(() => {
    if (mode !== "quiz") return null;
    const correct = card.meaning;
    const pool = RADICALS.filter((r) => r.id !== card.id);
    const opts = shuffle(pool)
      .slice(0, 3)
      .map((r) => r.meaning);
    const options = shuffle([correct, ...opts]);
    return { correct, options };
  }, [mode, card.id]);

  const grade = (g) => {
    const currentBox = pr.box || 1;
    const nextBox = applyGrade(currentBox, g);
    const t = todayStart();
    const due = addDays(t, intervalByBox(nextBox));

    patchId(card.id, {
      box: nextBox,
      learned: pr.learned || g >= 3,
      lastReviewed: new Date().toISOString(),
      due: iso(due),
      correct: (pr.correct || 0) + (g >= 3 ? 1 : 0),
      wrong: (pr.wrong || 0) + (g <= 2 ? 1 : 0),
    });

    setFlipped(false);
    setQuizChoice(null);
    setQuizReveal(false);
    setIndex((i) => (i + 1 < deck.length ? i + 1 : 0));
  };

  const handleFlip = () => {
    if (mode === "quiz") return;
    setFlipped((f) => !f);
  };

  useEffect(() => {
    if (!settings.keyboardShortcuts) return;
    const onKey = (e) => {
      if (e.key === "Escape") onExit?.();
      if (e.key === " ") {
        e.preventDefault();
        if (mode !== "quiz") setFlipped(true);
      }
      if (mode !== "quiz") {
        if (!flipped) return;
        if (e.key === "1") grade(1);
        if (e.key === "2") grade(2);
        if (e.key === "3") grade(3);
        if (e.key === "4") grade(4);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [settings.keyboardShortcuts, flipped, mode, card.id]);

  const submitQuiz = () => {
    if (!quiz || quizChoice == null) return;
    setQuizReveal(true);
  };

  const nextQuiz = () => {
    const isCorrect = quizChoice === quiz.correct;
    grade(isCorrect ? 3 : 1);
  };

  const timeStr = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="rounded-2xl gap-2 bg-white/70 hover:bg-white" onClick={onExit}>
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <Badge className={`rounded-2xl border ${theme.chip}`}>{theme.label}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <StatChip label="Thẻ" value={`${index + 1}/${total}`} />
          <StatChip label="Box" value={pr.box || 1} />
          <StatChip label="Time" value={timeStr} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/70 p-2">
        <Progress value={pct} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="rounded-2xl shadow-sm overflow-hidden border-slate-200 bg-white/80">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center justify-between gap-3 text-lg">
              <span className="flex items-center gap-2">
                <Sparkles className={`h-5 w-5 ${theme.icon}`} />
                {mode === "quiz" ? "Chọn đáp án" : "Flashcard"}
              </span>
              <Badge variant="outline" className="rounded-2xl border-slate-200 text-slate-700">
                ID {card.id}
              </Badge>
            </CardTitle>
            <div className="text-sm text-slate-600">
              {mode === "quiz" ? "Bộ thủ → Ý nghĩa" : "Space để lật, 1–4 để chấm"}
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <motion.div
              layout
              className={`relative rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 md:p-10 ring-1 ${theme.ring}`}
            >
              {mode !== "quiz" ? (
                <button onClick={handleFlip} className="w-full text-left" aria-label="Flip">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-slate-600">Bộ thủ</div>
                      <div className="mt-2 text-5xl md:text-6xl font-semibold tracking-wide text-slate-900">
                        {card.radical}
                      </div>
                      <div className="mt-3 text-sm text-slate-600">
                        {flipped ? "Đáp án" : "Tự nhớ: tên VN, pinyin, ý nghĩa"}
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <Badge className={`rounded-2xl border ${theme.chip}`}>Box {pr.box || 1}</Badge>
                    </div>
                  </div>

                  <AnimatePresence>
                    {flipped && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-6 space-y-3"
                      >
                        <Separator />
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="rounded-2xl border border-slate-200 bg-sky-50/60 p-4">
                            <div className="text-xs text-slate-600">Tên bộ (VN)</div>
                            <div className="mt-1 text-lg font-semibold text-slate-900">{card.vn}</div>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-violet-50/50 p-4">
                            <div className="text-xs text-slate-600">Pinyin</div>
                            <div className="mt-1 text-lg font-semibold text-slate-900">
                              {formatPinyin(card, settings.toneMarks)}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-amber-50/50 p-4">
                          <div className="text-xs text-slate-600">Ý nghĩa</div>
                          <div className="mt-1 text-slate-900">{card.meaning}</div>
                        </div>

                        {settings.showMnemonic && (
                          <div className="rounded-2xl border border-slate-200 bg-emerald-50/40 p-4">
                            <div className="text-xs text-slate-600">Mẹo nhớ</div>
                            <div className="mt-1 text-slate-900">{card.mnemonic}</div>
                          </div>
                        )}

                        {settings.showExamples && (
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-xs text-slate-600">Ví dụ</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {card.examples.map((e) => (
                                <Badge
                                  key={e}
                                  className="rounded-2xl border border-slate-200 bg-white text-base text-slate-800"
                                >
                                  {e}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-slate-600">Bộ thủ</div>
                    <div className="mt-2 text-5xl md:text-6xl font-semibold tracking-wide text-slate-900">
                      {card.radical}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm text-slate-800">Chọn ý nghĩa gần đúng nhất</div>
                    <div className="mt-3 grid gap-2">
                      {quiz?.options?.map((opt) => {
                        const picked = quizChoice === opt;
                        const correct = quizReveal && opt === quiz.correct;
                        const wrong = quizReveal && picked && opt !== quiz.correct;
                        return (
                          <button
                            key={opt}
                            onClick={() => !quizReveal && setQuizChoice(opt)}
                            className={
                              "rounded-2xl border p-3 text-left transition " +
                              (picked && !quizReveal ? "border-slate-300 bg-white" : "border-slate-200 bg-white") +
                              (correct ? " border-emerald-200 bg-emerald-50" : "") +
                              (wrong ? " border-rose-200 bg-rose-50" : "")
                            }
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-sm md:text-base text-slate-900">{opt}</div>
                              {correct && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {!quizReveal ? (
                    <Button className={`rounded-2xl ${theme.solid}`} disabled={quizChoice == null} onClick={submitQuiz}>
                      Nộp
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm text-slate-600">Đáp án đúng</div>
                      <div className="font-semibold text-slate-900">{quiz.correct}</div>
                      <Button className={`rounded-2xl ${theme.solid}`} onClick={nextQuiz}>
                        Tiếp
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {mode !== "quiz" && (
              <div className="mt-4">
                {!flipped ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button className={`rounded-2xl ${theme.solid}`} onClick={() => setFlipped(true)}>
                      Hiện đáp án
                    </Button>
                    {settings.keyboardShortcuts && (
                      <div className="text-sm text-slate-600">
                        <SmallKbd>Space</SmallKbd> để lật
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-2 md:grid-cols-4">
                    <Button variant="secondary" className="rounded-2xl bg-white hover:bg-slate-50" onClick={() => grade(1)}>
                      1 Again
                    </Button>
                    <Button variant="secondary" className="rounded-2xl bg-white hover:bg-slate-50" onClick={() => grade(2)}>
                      2 Hard
                    </Button>
                    <Button className={`rounded-2xl ${theme.solid}`} onClick={() => grade(3)}>
                      3 Good
                    </Button>
                    <Button className={`rounded-2xl ${theme.solid}`} onClick={() => grade(4)}>
                      4 Easy
                    </Button>
                    {settings.keyboardShortcuts && (
                      <div className="md:col-span-4 mt-2 text-sm text-slate-600">
                        Phím tắt: <SmallKbd>1</SmallKbd> <SmallKbd>2</SmallKbd> <SmallKbd>3</SmallKbd> <SmallKbd>4</SmallKbd>
                        <span className="mx-2">•</span>
                        <SmallKbd>Esc</SmallKbd> để thoát
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-slate-200 bg-white/80">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Timer className={`h-5 w-5 ${theme.icon}`} />
              Thông tin
            </CardTitle>
            <div className="text-sm text-slate-600">Nhẹ, tập trung, nhưng có màu để dễ nhìn hơn.</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-600">Hạn ôn</div>
              <div className="mt-1 text-base font-semibold text-slate-900">{new Date(pr.due).toLocaleDateString()}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-600">Thống kê thẻ này</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge className="rounded-2xl border border-slate-200 bg-emerald-50 text-emerald-700">Đúng: {pr.correct || 0}</Badge>
                <Badge className="rounded-2xl border border-slate-200 bg-rose-50 text-rose-700">Sai: {pr.wrong || 0}</Badge>
                <Badge className="rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">Learned: {pr.learned ? "Yes" : "No"}</Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-600">Mẹo dùng nhanh</div>
              <div className="mt-2 space-y-2 text-sm text-slate-800">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-slate-600" />
                  <span>
                    <SmallKbd>Space</SmallKbd> lật, <SmallKbd>1–4</SmallKbd> chấm
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4 text-slate-600" />
                  <span>Nếu ôn hết vòng, hệ thống quay lại thẻ đầu</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ManageList({ api, onBack }) {
  const { progress } = api;
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const qq = normalize(q);
    const base = RADICALS.filter((r) => {
      if (!qq) return true;
      const hay = normalize([r.vn, r.radical, r.pinyin, r.meaning, r.examples.join(" ")].join(" "));
      return hay.includes(qq);
    });
    return base;
  }, [q]);

  return (
    <div className="space-y-4">
      <TopBar
        title="Danh sách 60 bộ thủ"
        subtitle="Tìm nhanh theo bộ thủ, pinyin, ý nghĩa, ví dụ"
        right={
          <Button variant="secondary" className="rounded-2xl gap-2 bg-white/70 hover:bg-white" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        }
      />

      <div className="relative">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm… (vd: 氵, shuǐ, nước, 路)"
          className="rounded-2xl bg-white/80"
        />
      </div>

      <Card className="rounded-2xl shadow-sm border-slate-200 bg-white/80">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center justify-between gap-3 text-lg">
            <span className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-sky-700" />Tất cả
            </span>
            <Badge className="rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">{list.length}/60</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[560px] overflow-auto">
          <div className="space-y-2">
            {list.map((r) => {
              const pr = progress.byId[r.id] || { box: 1, learned: false };
              return (
                <div
                  key={r.id}
                  className={
                    "rounded-2xl border border-slate-200 bg-white p-3 " +
                    (pr.learned ? "ring-1 ring-emerald-100" : "")
                  }
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {r.id}. {r.vn} <span className="ml-2 font-semibold">{r.radical}</span>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        {r.pinyin} • {r.meaning}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {r.examples.slice(0, 5).map((e) => (
                          <Badge key={e} className="rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
                            {e}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="rounded-2xl border border-slate-200 bg-white text-slate-700">Box {pr.box || 1}</Badge>
                      <Badge
                        className={
                          "rounded-2xl border " +
                          (pr.learned
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-50 text-slate-700")
                        }
                      >
                        {pr.learned ? "Đã học" : "Chưa"}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Radicals60StudySite() {
  const api = useProgress();
  const { progress } = api;

  const [page, setPage] = useState("home");
  const [mode, setMode] = useState("learn");

  const dueCount = useMemo(() => {
    const t = todayStart();
    return RADICALS.filter((r) => new Date(progress.byId[r.id]?.due || 0) <= t).length;
  }, [progress.byId]);

  const learnedCount = useMemo(() => RADICALS.filter((r) => progress.byId[r.id]?.learned).length, [progress.byId]);

  const theme = MODE_META[mode] || MODE_META.learn;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50">
              <BookOpen className="h-5 w-5 text-sky-700" />
            </div>
            <div>
              <div className="text-2xl font-semibold tracking-tight">60 Bộ thủ thông dụng</div>
              <div className="mt-1 text-sm text-slate-600">Giao diện study mode gọn, có điểm nhấn màu để dễ tập trung.</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SettingsDialog api={api} />
          </div>
        </div>

        <div className="mt-6">
          {page === "home" && (
            <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
              <Card className="rounded-2xl shadow-sm border-slate-200 bg-white/80">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg">Bắt đầu học</CardTitle>
                  <div className="text-sm text-slate-600">Chọn chế độ, vào thẳng màn hình flashcard.</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-3">
                    <button
                      onClick={() => {
                        setMode("learn");
                        setPage("select");
                      }}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:bg-sky-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-sky-500" />
                        <div className="text-sm font-semibold">Học</div>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">Đi lần lượt hoặc xáo</div>
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Badge className="rounded-2xl border border-sky-200 bg-sky-50 text-sky-700">60 thẻ</Badge>
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setMode("review");
                        setPage("select");
                      }}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:bg-amber-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <div className="text-sm font-semibold">Ôn</div>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">Theo hạn (SRS)</div>
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Badge className="rounded-2xl border border-amber-200 bg-amber-50 text-amber-800">Đến hạn: {dueCount}</Badge>
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setMode("quiz");
                        setPage("select");
                      }}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:bg-violet-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-violet-500" />
                        <div className="text-sm font-semibold">Kiểm tra</div>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">Trắc nghiệm nhanh</div>
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Badge className="rounded-2xl border border-violet-200 bg-violet-50 text-violet-700">Random</Badge>
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                      </div>
                    </button>
                  </div>

                  <Separator />

                  <div className="flex flex-wrap gap-2">
                    <Button className={`rounded-2xl gap-2 ${theme.solid}`} onClick={() => setPage("select")}
                    >
                      Vào Study
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" className="rounded-2xl bg-white/70 hover:bg-white" onClick={() => setPage("list")}
                    >
                      Xem danh sách
                    </Button>
                  </div>

                  <div className="mt-2 text-sm text-slate-600">
                    Gợi ý phím tắt: <SmallKbd>Space</SmallKbd> lật thẻ, <SmallKbd>1–4</SmallKbd> chấm điểm.
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm border-slate-200 bg-white/80">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg">Tiến độ</CardTitle>
                  <div className="text-sm text-slate-600">Tự lưu trên máy bạn.</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-sm text-slate-600">Đã học</div>
                    <div className="mt-1 text-2xl font-semibold">{learnedCount} / 60</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-sm text-slate-600">Đến hạn ôn hôm nay</div>
                    <div className="mt-1 text-2xl font-semibold">{dueCount}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-sm text-slate-600">Chế độ gợi ý</div>
                    <div className="mt-1 text-sm text-slate-800">{dueCount ? "Bạn nên vào Ôn trước." : "Bạn có thể vào Học hoặc Kiểm tra."}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {page === "select" && (
            <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
              <Card className="rounded-2xl shadow-sm border-slate-200 bg-white/80">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg">Study</CardTitle>
                  <div className="text-sm text-slate-600">Chọn chế độ rồi bấm Start.</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-3">
                    {[
                      { key: "learn", meta: MODE_META.learn, desc: "Flashcard lật & chấm" },
                      { key: "review", meta: MODE_META.review, desc: "Ưu tiên thẻ đến hạn" },
                      { key: "quiz", meta: MODE_META.quiz, desc: "Bộ thủ → ý nghĩa" },
                    ].map((m) => (
                      <button
                        key={m.key}
                        onClick={() => setMode(m.key)}
                        className={
                          "rounded-2xl border p-4 text-left transition " +
                          (mode === m.key ? `border-slate-300 ${m.meta.soft}` : "border-slate-200 bg-white hover:bg-slate-50")
                        }
                      >
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${m.meta.dot}`} />
                          <div className="text-sm font-semibold">{m.meta.label}</div>
                        </div>
                        <div className="mt-1 text-sm text-slate-600">{m.desc}</div>
                      </button>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex flex-wrap gap-2">
                    <Button className={`rounded-2xl gap-2 ${theme.solid}`} onClick={() => setPage("session")}
                    >
                      Start
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" className="rounded-2xl bg-white/70 hover:bg-white" onClick={() => setPage("home")}
                    >
                      Quay về
                    </Button>
                    <Button variant="secondary" className="rounded-2xl bg-white/70 hover:bg-white" onClick={() => setPage("list")}
                    >
                      Danh sách
                    </Button>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    Mình đã thêm màu nhấn để mắt dễ bám vào thông tin (mà không bị rối).
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm border-slate-200 bg-white/80">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg">Nhắc nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-sm text-slate-600">Deck</div>
                    <div className="mt-1 text-base font-semibold">Radicals 60</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-sm text-slate-600">Phím tắt</div>
                    <div className="mt-2 space-y-2 text-sm text-slate-800">
                      <div><SmallKbd>Space</SmallKbd> lật thẻ</div>
                      <div><SmallKbd>1</SmallKbd> Again • <SmallKbd>2</SmallKbd> Hard • <SmallKbd>3</SmallKbd> Good • <SmallKbd>4</SmallKbd> Easy</div>
                      <div><SmallKbd>Esc</SmallKbd> thoát</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {page === "session" && <StudySession api={api} mode={mode} onExit={() => setPage("select")} />}

          {page === "list" && <ManageList api={api} onBack={() => setPage("home")} />}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600">
          Tip: Nếu bạn muốn màu mạnh hơn hoặc đổi tone (xanh lá, xanh dương, tím), nói mình biết tone bạn thích.
        </div>
      </div>
    </div>
  );
}
