#pragma once
#include "RNOH/ArkTSTurboModule.h"

namespace rnoh {
    class JSI_EXPORT RTNPermissionsTurboModule : public ArkTSTurboModule {
    public:
        RTNPermissionsTurboModule(const ArkTSTurboModule::Context ctx, const std::string name);
    };
} // namespace rnoh
