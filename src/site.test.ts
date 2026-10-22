/**
 * Copyright (c) 2026 Tetsuya Higashi
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { extractPage } from "../shared/ts/lib/extract";
import { isDocUrl } from "../shared/ts/lib/docUrl";
import { resolveSectionUrl, sectionPage, splitSections } from "../shared/ts/lib/sections";
import { site } from "./site";

/** 作り物の, 1 ページのガイドライン風のページ (ドキュメントの文章は使わない). */
const PAGE = `<html><head><title>Sample Guide</title></head><body>
<div class="sidebar"><nav><a class="sidebar-nav-item" href="#s-two">Side menu</a></nav></div>
<div class="banner"><a href="https://github.com/example/guide">Fork me</a></div>
<div class="content container">
<h1 id="one"><a name="main"></a>One</h1>
<p>Intro <a href="#r-two-a">to rule</a>.</p>
<h1 id="two"><a name="s-two"></a>Two</h1>
<h2 id="two-x"><a name="ss-two-x"></a>Two X</h2>
<h3 id="r-a"><a name="r-two-a"></a>T.1: Rule A</h3>
<div class="highlight"><pre><code>int x = 0;</code></pre></div>
</div></body></html>`;

const BASE = "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines";

describe("C++ Core Guidelines site profile", () => {
  it("opens only the guidelines page, starting from it", () => {
    expect(isDocUrl(site.homeUrl, site)).toBe(true);
    expect(isDocUrl(`${BASE}?section=two#r-two-a`, site)).toBe(true);
    expect(isDocUrl("https://isocpp.github.io/OtherProject/", site)).toBe(false);
    expect(isDocUrl("https://example.com/CppCoreGuidelines/CppCoreGuidelines", site)).toBe(false);
  });

  it("takes the content without the side menu and the banner", () => {
    const page = extractPage(PAGE, BASE, site);
    expect(page.html).toContain("Intro");
    expect(page.html).not.toContain("Side menu");
    expect(page.html).not.toContain("Fork me");
  });

  it("splits the page at the chapters and opens the chapter of a rule", () => {
    const sections = site.sections;
    expect(sections).toBeDefined();
    if (sections === undefined) {
      return;
    }
    const sectioned = splitSections(extractPage(PAGE, BASE, site), sections);
    expect(sectioned.sections.map((section) => section.title)).toEqual(["One", "Two"]);
    expect(sectioned.menu[1].children[0].children[0]).toEqual({
      title: "T.1: Rule A",
      url: `${BASE}?section=two#r-a`,
      children: [],
    });
    const url = resolveSectionUrl(sectioned, `${BASE}#r-two-a`);
    expect(url).toBe(`${BASE}?section=two#r-two-a`);
    const page = sectionPage(sectioned, url);
    expect(page.title).toBe("Two");
    expect(page.html).toContain("int x = 0;");
    expect(sectionPage(sectioned, BASE).html).toContain(`href="${BASE}?section=two#r-two-a"`);
  });
});
