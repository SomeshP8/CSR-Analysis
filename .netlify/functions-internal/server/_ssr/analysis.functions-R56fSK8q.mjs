import { r as reactExports } from "../_libs/react.mjs";
import { u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { m as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-w3ftRwoN.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CkSGFcSl.mjs";
import { g as objectType, i as stringType, k as enumType } from "../_libs/zod.mjs";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const analyzeReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(objectType({
  companyName: stringType().trim().max(200).optional(),
  text: stringType().trim().min(50, "Please provide at least 50 characters of report text.").max(2e5),
  sourceType: enumType(["pdf", "text", "company"]).default("text")
})).handler(createSsrRpc("6f1e6ac06647cdc439ea342f0ab2b99a02d85d918528e5fc6a2fea3ee5e3f441"));
const listReports = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("95604494974cea9ce42187aa660f67f770d2a84532b74339707eb7bc9f010fd0"));
const getReport = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(objectType({
  id: stringType().uuid()
})).handler(createSsrRpc("1d7a58b6446b58afdaa4afb0f833d92612815acdfe90a42cfe59bd5af4a7c75b"));
const deleteReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(objectType({
  id: stringType().uuid()
})).handler(createSsrRpc("61b26c3948cf65407b96d7a11494283173fb6aed8a696c5be7ebf22deae661a3"));
const getStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("a0e8452e9fc39c3711b8e08e085e035e203bbb5317a17849f10b31c286ad6a0c"));
export {
  analyzeReport as a,
  getReport as b,
  deleteReport as d,
  getStats as g,
  listReports as l,
  useServerFn as u
};
