import { createElement, getElementById, querySelectorAll } from "../lib/dom-utils";
import { Line } from "./models";

export function openLine(line: Line, closeRest = true): boolean {
  const lineElement = getElementById(line.id)!;

  if (lineElement.classList.contains('open')) return false;

  if (closeRest) {
    querySelectorAll('.line.open').forEach(a => a.classList.remove('open'));
  }

  lineElement.classList.add('open');
  return true;
}

export function toggleLine(line: Line, closeRest = true) {

  const lineElement = getElementById(line.id)!;

  const isOpened = !openLine(line, closeRest);

  if (isOpened) {
    lineElement.classList.remove('open');
  }
}

export function generateHtmlLogo(line: Line): HTMLSpanElement {
  const logoWrapper = createElement('span', 'logo-wrapper');
  logoWrapper.style.display = 'inline-block';

  const logo = createElement('span', 'line-logo', logoWrapper);
  logo.setAttribute('content', line.logo);
  logo.style.backgroundColor = line.color;

  return logoWrapper;
}