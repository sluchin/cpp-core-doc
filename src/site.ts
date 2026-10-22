/**
 * Copyright (c) 2026 Tetsuya Higashi
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { SiteProfile } from "../shared/ts/lib/profile";

/** ドキュメントのホストの URL. */
const ORIGIN = "https://isocpp.github.io";

/**
 * C++ Core Guidelines (GitHub Pages. 全体が 1 つの大きなページ) の設定.
 *
 * リポジトリ (isocpp/CppCoreGuidelines) の Markdown から作られた, 1 つのページ (約 1.3 MB) を, 章の見出し
 * (`h1`) ごとに分けて開く (共通のコードの `sections`). 本文は `.content` (左の目次と, GitHub への
 * リンクの外). メニューは, 章 (`h1`), 節 (`h2`), 規則 (`h3`) の見出しから作る.
 */
export const site: SiteProfile = {
  name: "C++ Core Doc",
  host: "isocpp.github.io",
  // 同じホストの, ほかのプロジェクトのページは開かない
  pathPrefix: "/CppCoreGuidelines/CppCoreGuidelines",
  homeUrl: `${ORIGIN}/CppCoreGuidelines/CppCoreGuidelines`,
  contentSelectors: [".content"],
  removeSelectors: [],
  titleSuffix: /^C\+\+ Core Guidelines$/,
  sections: { split: "h1", menuLevels: ["h1", "h2", "h3"] },
};
