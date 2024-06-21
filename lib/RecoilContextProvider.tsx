"use client";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

export default function RecoilContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
