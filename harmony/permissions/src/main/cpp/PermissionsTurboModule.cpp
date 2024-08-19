#include "PermissionsTurboModule.h"
#include "RNOH/ArkTSTurboModule.h"

using namespace rnoh;
using namespace facebook;

static jsi::Value __hostFunction_RTNPermissionsTurboModule_check(jsi::Runtime &rt, react::TurboModule &turboModule,
                                                                 const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "check", args, count);
}
static jsi::Value __hostFunction_RTNPermissionsTurboModule_checkMultiple(jsi::Runtime &rt,
                                                                         react::TurboModule &turboModule,
                                                                         const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "checkMultiple", args, count);
}
static jsi::Value __hostFunction_RTNPermissionsTurboModule_request(jsi::Runtime &rt, react::TurboModule &turboModule,
                                                                   const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "request", args, count);
}

static jsi::Value __hostFunction_RTNPermissionsTurboModule_requestMultiple(jsi::Runtime &rt,
                                                                           react::TurboModule &turboModule,
                                                                           const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "requestMultiple", args, count);
}

static jsi::Value __hostFunction_RTNPermissionsTurboModule_requestNotifications(jsi::Runtime &rt,
                                                                           react::TurboModule &turboModule,
                                                                           const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "requestNotifications", args, count);
}
static jsi::Value __hostFunction_RTNPermissionsTurboModule_checkNotifications(jsi::Runtime &rt,
                                                                           react::TurboModule &turboModule,
                                                                           const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "checkNotifications", args, count);
}
static jsi::Value __hostFunction_RTNPermissionsTurboModule_openSettings(jsi::Runtime &rt,
                                                                           react::TurboModule &turboModule,
                                                                           const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "openSettings", args, count);
}
static jsi::Value __hostFunction_RTNPermissionsTurboModule_openPhotoPicker(jsi::Runtime &rt,
                                                                           react::TurboModule &turboModule,
                                                                           const jsi::Value *args, size_t count) {
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "openPhotoPicker", args, count);
}

RTNPermissionsTurboModule::RTNPermissionsTurboModule(const ArkTSTurboModule::Context ctx, const std::string name)
    : ArkTSTurboModule(ctx, name) {
    methodMap_["check"] = MethodMetadata{1, __hostFunction_RTNPermissionsTurboModule_check};
    methodMap_["checkMultiple"] = MethodMetadata{1, __hostFunction_RTNPermissionsTurboModule_checkMultiple};
    methodMap_["request"] = MethodMetadata{1, __hostFunction_RTNPermissionsTurboModule_request};
    methodMap_["requestMultiple"] = MethodMetadata{1, __hostFunction_RTNPermissionsTurboModule_requestMultiple};
    methodMap_["requestNotifications"] = MethodMetadata{0, __hostFunction_RTNPermissionsTurboModule_requestNotifications};
    methodMap_["checkNotifications"] = MethodMetadata{0, __hostFunction_RTNPermissionsTurboModule_checkNotifications};
    methodMap_["openSettings"] = MethodMetadata{0, __hostFunction_RTNPermissionsTurboModule_openSettings};
    methodMap_["openPhotoPicker"] = MethodMetadata{0, __hostFunction_RTNPermissionsTurboModule_openPhotoPicker};
}