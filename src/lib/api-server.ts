import {
  CompanySearchItem,
  DrugEquityItem,
  DrugDetailItem,
  DrugPreclinicalItem,
  DrugSummaryItem,
  DrugTrialItem,
  SearchCategory,
  TargetSearchItem,
  TargetSummaryItem,
  TargetDruggabilityItem,
  TargetDrugDevelopmentResultsItem,
  TargetTreatmentEffectItem,
} from '@/types';
import 'server-only';
import fetchServer from './fetch-server';

export const quickSearch = async (
  keyword: string,
): Promise<{
  disease: number;
  drug: number;
  target: number;
  company: number;
  trial: number;
}> => {
  const resp = await fetchServer({
    url:
      process.env.API_BASE_URL +
      '/search/summary?' +
      new URLSearchParams({
        q: keyword,
      }),
  });

  const result = await resp.json();

  return result;
};

export const getTableResult = async <T>(
  keyword: string,
  category: string,
  page: number = 1,
  pageSize: number = 10,
  filters: Record<string, string[]>,
  sort?: Record<string, string>[],
  tableFilters?: Record<string, string[]>,
): Promise<{
  total: number;
  data: T[];
  status?: number;
}> => {
  try {
    const resp = await fetchServer({
      url: process.env.API_BASE_URL + '/search',
      method: 'POST',
      body: JSON.stringify({
        q: keyword,
        category,
        filter_params: filters,
        page,
        page_size: pageSize,
        sort_params: sort,
        table_filter_params: tableFilters,
      }),
    });

    const result = await resp.json();

    return { ...result, status: 200 };
  } catch (e) {
    return {
      total: 0,
      data: [],
      status: (e as any).cause?.status,
    };
  }
};

export const getUser = async (): Promise<{
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  company: string;
  job_position: string;
  roles: {
    id: number;
    name: string;
    deadline: string;
  }[];
}> => {
  const response = await fetchServer({
    url: process.env.API_BASE_URL + '/user',
  });

  return await response.json();
};

export const getDrugDetail = async (id: number): Promise<DrugDetailItem> => {
  const resp = await fetchServer({
    url: `${process.env.API_BASE_URL}/drug/${id}`,
  });

  return await resp.json();
};

export const getCompanyDetail = async (
  id: number,
): Promise<CompanySearchItem> => {
  const resp = await fetchServer({
    url: `${process.env.API_BASE_URL}/company/${id}`,
  });

  return await resp.json();
};

export const getTargetDetail = async (
  id: number,
): Promise<TargetSearchItem> => {
  const resp = await fetchServer({
    url: `${process.env.API_BASE_URL}/target/${id}`,
  });

  return await resp.json();
};

export const getTargetSummary = async (
  id: number,
): Promise<TargetSummaryItem> => {
  const resp = await fetchServer({
    url: `${process.env.API_BASE_URL}/target/summary/${id}`,
  });
  return await resp.json();
};

export const getTargetDruggability = async (
  id: number,
): Promise<TargetDruggabilityItem[]> => {
  const resp = await fetchServer({
    url: `${process.env.API_BASE_URL}/target/druggability/${id}`,
  });
  return await resp.json();
};

export const getTargetDrugDevelopmentResults = async (
  id: number,
): Promise<TargetDrugDevelopmentResultsItem> => {
  const resp = await fetchServer({
    url: `${process.env.API_BASE_URL}/target/drug_development_results/${id}`,
  });
  return await resp.json();
};

export const getTargetTreatmentEffect = async (
  id: number,
): Promise<TargetTreatmentEffectItem[]> => {
  const resp = await fetchServer({
    url: `${process.env.API_BASE_URL}/target/treatment_effect/${id}`,
  });
  return await resp.json();
};

export async function getFilters(
  keyword: string,
  category: SearchCategory,
): Promise<{
  [key: string]: {
    option: string;
    count: number;
  }[];
}> {
  const resp = await fetchServer({
    url:
      process.env.API_BASE_URL +
      '/search/filters?' +
      new URLSearchParams({
        q: keyword,
        category: category,
      }),
  });

  const result = await resp.json();

  return result;
}

// Summary
export const getDrugSummary = async (id: number): Promise<DrugSummaryItem> => {
  const resp = await fetchServer({
    url: `${process.env.API_BASE_URL}/drug/summary/${id}`,
  });

  return await resp.json();
};

// 权益归属
export const getDrugEquity = async (id: number): Promise<DrugEquityItem> => {
  const resp = await fetchServer({
    url: `${process.env.API_BASE_URL}/drug/equity/${id}`,
  });

  return await resp.json();
};

// 临床试验
export const getDrugTrial = async (id: number): Promise<DrugTrialItem> => {
  const resp = await fetchServer({
    url: `${process.env.API_BASE_URL}/drug/trial/${id}`,
  });

  return await resp.json();
};

// 临床前研究
export const getDrugPreclinical = async (
  id: number,
): Promise<DrugPreclinicalItem> => {
  const resp = await fetchServer({
    url: `${process.env.API_BASE_URL}/drug/preclinical/${id}`,
  });

  return await resp.json();
};
