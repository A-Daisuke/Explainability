function __method_wrapper__() {
  async run({ $ }) {
    const response = await this.gloriaAi.createContact({
      $,
      data: {
        tenantId: this.gloriaAi.$auth.tenant_id,
        createdAt: Date.now(),
        name: [
          this.leadName,
        ],
        phone: this.phone && [
          this.phone,
        ],
        email: this.email && [
          this.email,
        ],
        origin: "api",
        initiation: this.initiation,
        tags: this.tags,
        status: this.status,
      },
    });
    $.export("$summary", `Successfully created lead with ID: ${response.id}`);
    return response;
  },

}
