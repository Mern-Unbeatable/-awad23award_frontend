import { SCHEDULING_ENDPOINTS } from '../../services/endpoints/scheduling.endpoints';
import { http } from '../../services/http';
import type { SchedulingUpdatePayload } from './schedulingTypes';

export const getSchedulingSettingsRequest = () =>
  http.get(SCHEDULING_ENDPOINTS.ADMIN);

export const updateSchedulingSettingsRequest = (body: SchedulingUpdatePayload) =>
  http.put(SCHEDULING_ENDPOINTS.ADMIN, body);
