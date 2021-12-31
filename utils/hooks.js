import useSWR from "swr";
import { baseUrl, fetcher } from "./api";

export const useLocaleDateString = () => {
  const getLocaleDateString = (date) =>
    new Date(date).toLocaleDateString(navigator.language);
  return { getLocaleDateString };
};

export const useLocaleString = () => {
  const getLocaleDateString = (date) =>
    new Date(date).toLocaleString(navigator.language);
  return { getLocaleDateString };
};

export const useEmployee = () => {
  const { data, error } = useSWR(`${baseUrl}/Employee`, fetcher);

  return {
    employees: data,
    isLoading: !error && !data,
    isError: error,
    error,
  };
};
