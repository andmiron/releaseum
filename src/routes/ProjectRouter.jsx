import { Routes, Route } from "react-router-dom";
import { getSubdomain } from "../lib/subdomain";

export function ProjectRouter() {
  const subdomain = getSubdomain();

  return <h1>ProjectRouter: {subdomain}</h1>;
}
